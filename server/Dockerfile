FROM node:22-alpine

WORKDIR /usr/src/app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy everything (except node_modules via volume)
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3030
