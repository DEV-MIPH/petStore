function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un email válido', 'warning');
        return;
    }

    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

        if (usuarioEncontrado) {
            const sesionUsuario = {
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email
            };

            localStorage.setItem('usuario', JSON.stringify(sesionUsuario));
            showNotification('✅ ¡Bienvenido de vuelta!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification('❌ Credenciales incorrectas o usuario no registrado', 'error');
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        showNotification('❌ Error al procesar el login', 'error');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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