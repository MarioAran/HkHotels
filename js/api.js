/**
 * HK HOTELS - Cliente API
 * Clase para comunicarse con el backend en Render
 * URL configurable para desarrollo y producción
 */
class HKApi {
    constructor() {
        // Usar la URL desde la configuración (config.js), con fallback
        this.baseUrl = (window.HK_CONFIG && window.HK_CONFIG.API_URL) 
            ? window.HK_CONFIG.API_URL 
            : 'https://hkhotels-backend.onrender.com/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en la petición');
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============ ENDPOINTS PÚBLICOS ============

    async getHabitaciones() {
        return this.request('/habitaciones');
    }

    async getHabitacion(id) {
        return this.request(`/habitaciones/${id}`);
    }

    async getServicios() {
        return this.request('/servicios');
    }

    async checkDisponibilidad(fechaInicio, fechaFin, habitacionId) {
        const params = new URLSearchParams({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            habitacion_id: habitacionId
        });
        return this.request(`/disponibilidad?${params}`);
    }

    async crearReserva(datos) {
        return this.request('/reservas', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async consultarReserva(email, codigo = null) {
        let url = `/reservas/consultar?email=${encodeURIComponent(email)}`;
        if (codigo) url += `&codigo=${codigo}`;
        return this.request(url);
    }

    async cancelarReserva(id, email) {
        return this.request(`/reservas/${id}/cancelar`, {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // ============ ENDPOINTS DE ADMIN (requieren token) ============

    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    async getHabitacionesAdmin(token) {
        return this.request('/admin/habitaciones', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async crearHabitacion(datos, token) {
        return this.request('/admin/habitaciones', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });
    }

    async actualizarHabitacion(id, datos, token) {
        return this.request(`/admin/habitaciones/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });
    }

    async eliminarHabitacion(id, token) {
        return this.request(`/admin/habitaciones/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async getServiciosAdmin(token) {
        return this.request('/admin/servicios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async crearServicio(datos, token) {
        return this.request('/admin/servicios', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });
    }

    async actualizarServicio(id, datos, token) {
        return this.request(`/admin/servicios/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });
    }

    async eliminarServicio(id, token) {
        return this.request(`/admin/servicios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async getReservasAdmin(token) {
        return this.request('/admin/reservas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async getEstadisticas(token) {
        return this.request('/admin/estadisticas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

// Instancia global de la API
const api = new HKApi();