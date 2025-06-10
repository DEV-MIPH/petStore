const productos = [
    {
        id: 1,
        nombre: 'Alimento Premium para Perros',
        precio: 10000,
        imagen: 'img/Alimento Premium para Perros.jpg',
        descripcion: 'Alimento balanceado con proteínas de alta calidad'
    },
    {
        id: 2,
        nombre: 'Juguete Interactivo para Gatos',
        precio: 5000,
        imagen: 'img/Juguete Interactivo para Gatos.jpg',
        descripcion: 'Juguete con plumas y sonidos para estimular a tu gato'
    },
    {
        id: 3,
        nombre: 'Collar Ajustable para Perro',
        precio: 7000,
        imagen: 'img/Collar Ajustable para Perro.jpg',
        descripcion: 'Collar cómodo y seguro con hebilla de liberación rápida'
    },
    {
        id: 4,
        nombre: 'Arena Sanitaria para Gatos',
        precio: 8000,
        imagen: 'img/Arena Sanitaria para Gatos.jpg',
        descripcion: 'Arena aglomerante con control de olores'
    },
    {
        id: 5,
        nombre: 'Cama para Mascotas',
        precio: 15000,
        imagen: 'img/Cama para Mascotas.jpg',
        descripcion: 'Cama suave y cómoda para perros y gatos'
    },
    {
        id: 6,
        nombre: 'Shampoo para Mascotas',
        precio: 6000,
        imagen: 'img/Shampoo para Mascotas.jpg',
        descripcion: 'Shampoo hipoalergénico con pH balanceado'
    }
];

let usuario = null;
try {
    usuario = JSON.parse(localStorage.getItem('usuario'));
} catch (error) {
    console.error('Error al cargar datos del usuario:', error);
}

function handleImageError(img) {
    img.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Producto+PetShop';
    img.alt = 'Imagen no disponible';
}

const container = document.getElementById("productos");

if (!container) {
    console.error('No se encontró el contenedor de productos');
} else {
    console.log('Cargando productos...');

    productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "col-lg-4 col-md-6 mb-4";
        div.innerHTML = `
          <div class="card h-100 product-card">
            <div class="card-img-wrapper">
              <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" loading="lazy" onerror="handleImageError(this)">
              <div class="card-overlay">
                <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                  <i class="fas fa-cart-plus"></i> Agregar
                </button>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text text-muted">${producto.descripcion}</p>
              <div class="mt-auto">
                <p class="card-text price">$${producto.precio.toLocaleString()}</p>
                <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id})">
                  <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
              </div>
            </div>
          </div>`;
        container.appendChild(div);
    });

    console.log(`Se cargaron ${productos.length} productos`);
}

function agregarAlCarrito(id) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        showNotification('Debes iniciar sesión para agregar productos al carrito', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    try {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(Number(id));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        showNotification('✅ Producto agregado al carrito', 'success');
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        showNotification('❌ Error al agregar al carrito', 'error');
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
