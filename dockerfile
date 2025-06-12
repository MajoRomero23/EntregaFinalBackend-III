# Imagen base oficial de Node
FROM node:18

# Crear y definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios al contenedor
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto (cámbialo si usas otro en tu .env)
EXPOSE 8080

# Comando por defecto para iniciar la app
CMD ["node", "app.js"]

