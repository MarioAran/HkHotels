/**
 * HK HOTELS - Módulo de Autenticación
 * Gestiona tokens JWT para el panel de administración
 */
class AuthManager {
    constructor() {
        this.tokenKey = 'hk_hotel_token';
        this.userKey = 'hk_hotel_user';
    }

    guardarToken(token, userData) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    obtenerToken() {
        return localStorage.getItem(this.tokenKey);
    }

    obtenerUsuario() {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    estaAutenticado() {
        return this.obtenerToken() !== null;
    }

    cerrarSesion() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        window.location.href = '/admin/login.html';
    }

    async login(username, password) {
        try {
            const response = await api.login(username, password);
            if (response.success) {
                this.guardarToken(response.data.token, response.data.usuario);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

const auth = new AuthManager();

// Proteger páginas de admin
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.includes('/admin/login.html')) {
    if (!auth.estaAutenticado()) {
        window.location.href = '/admin/login.html';
    }
}