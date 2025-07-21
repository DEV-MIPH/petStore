# Etapa 1: Build de la app Angular
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copia el build de Angular al directorio de Nginx
COPY --from=build /app/dist/petshop-angular /usr/share/nginx/html

# EXPOSE 80 para servir la app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 