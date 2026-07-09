# ============================================
# Dockerfile - HK Hotels Frontend (Nginx)
# ============================================

# --- Stage 1: Build ---
# --- Stage 1: Build ---
FROM ghcr.io/marioaran/python-base:3.12-slim

# Instalar Nginx
RUN apt-get update && \
    apt-get install -y nginx wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Eliminar configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/sites-enabled/default

# Copiar los archivos estáticos del frontend
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]