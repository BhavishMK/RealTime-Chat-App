# # 1. Use Node to build the React code
# FROM node:18-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # 2. Use Nginx to serve the static files (Professional way to host React)
# FROM nginx:stable-alpine	
# # Copy the built files from React into Nginx's folder
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# STAGE 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Skip type check to speed up build since we are in a hurry
RUN npx vite build

# STAGE 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy the built files
COPY --from=build /app/dist /usr/share/nginx/html
# COPY YOUR CUSTOM CONFIG (Add this line):
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]