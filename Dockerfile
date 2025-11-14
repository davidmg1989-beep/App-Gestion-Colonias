FROM nginx:stable-alpine

# Copy built static files
COPY ./dist /usr/share/nginx/html

# Replace default nginx conf with our SPA-friendly config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
