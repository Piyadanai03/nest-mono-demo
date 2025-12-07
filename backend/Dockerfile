# --- Stage 1: Development ---
FROM node:18-alpine AS development

# ติดตั้ง openssl สำหรับ Prisma (บน Alpine 3.17+)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client สำหรับ dev
RUN npx prisma generate

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

RUN npm run build ${APP_NAME}

# --- Stage 2: Production ---
FROM node:18-alpine AS production

# ติดตั้ง openssl ใน production ด้วย
RUN apk add --no-cache openssl libc6-compat

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Copy โฟลเดอร์ Prisma เข้ามา
COPY prisma ./prisma

# Generate Prisma Client ใน Environment นี้
RUN npx prisma generate

COPY --from=development /usr/src/app/dist ./dist

CMD node dist/apps/${APP_NAME}/main.js