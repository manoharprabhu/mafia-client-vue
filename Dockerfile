FROM node:latest AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Runtime image ----
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 5173

# Nginx config to serve on 5173
RUN sed -i 's/listen       80;/listen 5173;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]