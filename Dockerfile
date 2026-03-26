# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# แยกการ Copy เพื่อใช้ประโยชน์จาก Docker Cache (Build ครั้งต่อไปจะไวมาก)
COPY package*.json ./
RUN npm install

# Copy โค้ดที่เหลือ
COPY . .

# รับ API Key มาใช้ตอน Build
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Runner stage
FROM nginx:alpine

# เขียน Config ใหม่ที่รองรับ Gzip (ช่วยให้โหลดหน้าเว็บไวขึ้น)
RUN echo 'server { \
    listen 3000; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_proxied any; \
    gzip_min_length 1000; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    expires 1y; \
    add_header Cache-Control "public, no-transform"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]