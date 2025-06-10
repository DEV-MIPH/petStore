let usuario = null;
try {
    usuario = JSON.parse(localStorage.getItem('usuario'));
} catch (error) {
    console.error('Error al cargar datos del usuario:', error);
}

if (!usuario) {
    showNotification('Debes iniciar sesión para acceder al carrito', 'warning');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

const productos = [
    {
        id: 1,
        nombre: 'Alimento Premium para Perros',
        precio: 10000,
        imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        descripcion: 'Alimento balanceado con proteínas de alta calidad'
    },
    {
        id: 2,
        nombre: 'Juguete Interactivo para Gatos',
        precio: 5000,
        imagen: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
        descripcion: 'Juguete con plumas y sonidos para estimular a tu gato'
    },
    {
        id: 3,
        nombre: 'Collar Ajustable para Perro',
        precio: 7000,
        imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        descripcion: 'Collar cómodo y seguro con hebilla de liberación rápida'
    },
    {
        id: 4,
        nombre: 'Arena Sanitaria para Gatos',
        precio: 8000,
        imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
        descripcion: 'Arena aglomerante con control de olores'
    },
    {
        id: 5,
        nombre: 'Cama para Mascotas',
        precio: 15000,
        imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        descripcion: 'Cama suave y cómoda para perros y gatos'
    },
    {
        id: 6,
        nombre: 'Shampoo para Mascotas',
        precio: 6000,
        imagen: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
        descripcion: 'Shampoo hipoalergénico con pH balanceado'
    }
];

let carrito = [];
try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.map(id => Number(id));
} catch (error) {
    console.error('Error al cargar el carrito:', error);
    carrito = [];
}

const lista = document.getElementById("lista-carrito");
const totalSpan = document.getElementById("total");
let total = 0;

function contarProductos(carrito) {
    const conteo = {};
    carrito.forEach(id => {
        conteo[id] = (conteo[id] || 0) + 1;
    });
    return conteo;
}

function mostrarCarrito() {
    console.log('Carrito:', carrito);
    console.log('Productos:', productos);
    if (!lista) {
        console.error('No se encontró el contenedor #lista-carrito');
        return;
    }
    lista.innerHTML = '';
    total = 0;
    if (carrito.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "text-center py-5";
        emptyMessage.innerHTML = `
            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">Tu carrito está vacío</h4>
            <p class="text-muted">¡Agrega algunos productos para comenzar!</p>
            <a href="index.html" class="btn btn-primary mt-3">
                <i class="fas fa-arrow-left"></i> Ir a productos
            </a>
        `;
        lista.appendChild(emptyMessage);
        totalSpan.textContent = '0';
        return;
    }
    const conteoProductos = contarProductos(carrito);
    Object.keys(conteoProductos).forEach(productoId => {
        const producto = productos.find(p => p.id === parseInt(productoId));
        if (producto) {
            const cantidad = conteoProductos[productoId];
            const subtotal = producto.precio * cantidad;
            total += subtotal;
            const item = document.createElement("div");
            item.className = "cart-item";
            item.innerHTML = `
                <div class="cart-item-content">
                    <div class="cart-item-image">
                        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <h6 class="cart-item-title">${producto.nombre}</h6>
                        <p class="cart-item-description">${producto.descripcion}</p>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${cantidad}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="cart-item-price">
                                <span class="price">$${producto.precio.toLocaleString()}</span>
                                <span class="subtotal">Subtotal: $${subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger remove-btn" onclick="eliminarDelCarrito(${producto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            lista.appendChild(item);
        }
    });
    totalSpan.textContent = total.toLocaleString();
    mostrarBotonesAccion();
}

function cambiarCantidad(productoId, cambio) {
    if (cambio === -1) {
        const index = carrito.indexOf(productoId);
        if (index > -1) {
            carrito.splice(index, 1);
        }
    } else {
        carrito.push(productoId);
    }
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        showNotification('Carrito actualizado', 'success');
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        showNotification('Error al actualizar carrito', 'error');
    }
}

function mostrarBotonesAccion() {
    const botonesExistentes = document.querySelector('.cart-actions');
    if (botonesExistentes) {
        botonesExistentes.remove();
    }
    if (carrito.length > 0) {
        const botonesContainer = document.createElement("div");
        botonesContainer.className = "cart-actions";
        botonesContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                <a href="index.html" class="btn btn-outline-primary">
                    <i class="fas fa-arrow-left"></i> Seguir comprando
                </a>
                <div>
                    <button onclick="limpiarCarrito()" class="btn btn-outline-warning me-2">
                        <i class="fas fa-trash"></i> Vaciar carrito
                    </button>
                    <button onclick="finalizarCompra()" class="btn btn-success">
                        <i class="fas fa-credit-card"></i> Finalizar compra
                    </button>
                </div>
            </div>
        `;
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary && cartSummary.parentElement) {
            cartSummary.parentElement.insertBefore(botonesContainer, cartSummary.nextSibling);
        } else {
            document.querySelector('.container').appendChild(botonesContainer);
        }
    }
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(id => id !== productoId);
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        showNotification('Producto eliminado del carrito', 'success');
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        showNotification('Error al eliminar producto', 'error');
    }
}

function limpiarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        try {
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
            showNotification('Carrito vaciado', 'info');
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            showNotification('Error al vaciar carrito', 'error');
        }
    }
}

function finalizarCompra() {
    try {
        localStorage.removeItem('carrito');
        showNotification('¡Compra finalizada con éxito! Gracias por tu compra.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Error al finalizar compra:', error);
        showNotification('Error al finalizar compra', 'error');
    }
}

function logout() {
    try {
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrito');
        showNotification('👋 Sesión cerrada correctamente', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        window.location.href = 'index.html';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

mostrarCarrito();
