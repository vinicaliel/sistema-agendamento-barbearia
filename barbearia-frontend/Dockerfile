FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Angular app (SPA mode without SSR)
RUN npm run build -- --configuration production

# Production runtime
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install express

# Copy built app from build stage
COPY --from=build /app/dist/barbearia-frontend/browser ./dist

# Create a simple Express server to serve static files
RUN echo 'const express = require("express"); const path = require("path"); const app = express(); const distPath = "/app/dist"; app.use(express.static(distPath)); app.get("/*", (req, res) => res.sendFile(path.join(distPath, "index.html"))); app.listen(4200, "0.0.0.0", () => console.log("Frontend running on port 4200"));' > server.js

EXPOSE 4200

CMD ["node", "server.js"]
