# Usa una imagen base de Nginx (servidor web ligero)
FROM nginx:alpine

# Elimina los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos de tu landing page al directorio de Nginx
COPY . /usr/share/nginx/html

# Expone el puerto 80 (puerto por defecto para HTTP)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]