function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }

    if (nombre.length < 2) {
        showNotification('El nombre debe tener al menos 2 caracteres', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un email válido', 'warning');
        return;
    }

    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'warning');
        return;
    }

    let usuarios = [];
    try {
        const raw = localStorage.getItem('usuarios');
        usuarios = raw ? JSON.parse(raw) : [];
    } catch (e) {
        usuarios = [];
    }

    if (usuarios.some(user => user.email === email)) {
        showNotification('Este correo electrónico ya está registrado', 'error');
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    const usuarioActual = {
        nombre: nombre,
        email: email
    };

    localStorage.setItem('usuario', JSON.stringify(usuarioActual));

    showNotification('✅ ¡Registro exitoso! Bienvenido a PetShop', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Crear notificación
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