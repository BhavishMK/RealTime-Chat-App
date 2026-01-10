# 1. Use Node to build the React code
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Use Nginx to serve the static files (Professional way to host React)
FROM nginx:stable-alpine	
# Copy the built files from React into Nginx's folder
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]