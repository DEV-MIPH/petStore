// navbar-session.js
(function () {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;
    const loginItem = Array.from(nav.children).find(
        li => li.querySelector('.nav-link') && li.querySelector('.nav-link').textContent.trim().toLowerCase() === 'login'
    );
    if (usuario && loginItem) {
        const nombre = usuario.nombre ? usuario.nombre.split(' ')[0] : usuario.email;
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.href = '#';
        cerrarSesionLink.className = 'nav-link';
        cerrarSesionLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Cerrar sesión (${nombre})`;
        cerrarSesionLink.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem('usuario');
            localStorage.removeItem('carrito');
            window.location.reload();
        };
        loginItem.innerHTML = '';
        loginItem.appendChild(cerrarSesionLink);
    }
})(); 