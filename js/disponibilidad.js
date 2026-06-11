/**
 * HK HOTELS - Verificador de Disponibilidad
 * Comprueba habitaciones disponibles en tiempo real
 */
const Disponibilidad = {
    async verificar(fechaInicio, fechaFin, habitacionId = null) {
        try {
            const data = await api.checkDisponibilidad(fechaInicio, fechaFin, habitacionId);
            return data;
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            return { success: false, data: [] };
        }
    },

    async cargarHabitacionesDisponibles(fechaInicio, fechaFin) {
        const resultado = await this.verificar(fechaInicio, fechaFin);
        if (resultado.success) {
            this.mostrarHabitaciones(resultado.data);
        } else {
            this.mostrarError('No se pudieron cargar las habitaciones disponibles');
        }
    },

    mostrarHabitaciones(habitaciones) {
        const contenedor = document.getElementById('habitaciones-disponibles');
        if (!contenedor) return;

        if (!habitaciones || habitaciones.length === 0) {
            contenedor.innerHTML = `
                <div class="no-disponibles">
                    <i class="icono">🏨</i>
                    <h3>No hay habitaciones disponibles</h3>
                    <p>Intenta con otras fechas</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = habitaciones.map(h => `
            <div class="room-card fade-in">
                <div class="room-card-image">
                    <img src="${h.imagen_url || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}" 
                         alt="${h.nombre}" loading="lazy">
                    <span class="room-card-badge">Disponible</span>
                </div>
                <div class="room-card-body">
                    <h3>${h.nombre}</h3>
                    <div class="price">$${h.precio_noche} <span>/ noche</span></div>
                    <p class="description">${h.descripcion || 'Habitación con todas las comodidades'}</p>
                    <p>👥 Máx. ${h.max_personas} personas</p>
                    <a href="/reservas/formulario.html?habitacion=${h.id}" class="btn btn-gold" style="width:100%">
                        Reservar ahora
                    </a>
                </div>
            </div>
        `).join('');
    },

    mostrarError(mensaje) {
        const contenedor = document.getElementById('habitaciones-disponibles');
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="error-message">
                    <p>❌ ${mensaje}</p>
                </div>
            `;
        }
    }
};

// Event listeners para el buscador de disponibilidad
document.addEventListener('DOMContentLoaded', () => {
    const formBusqueda = document.getElementById('form-busqueda-disponibilidad');
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fechaInicio = document.getElementById('checkin').value;
            const fechaFin = document.getElementById('checkout').value;
            
            if (fechaInicio && fechaFin) {
                await Disponibilidad.cargarHabitacionesDisponibles(fechaInicio, fechaFin);
            }
        });
    }
});