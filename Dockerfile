FROM --platform=linux/arm64/v8 node:18-alpine

# Install build dependencies
RUN apk update && apk add --no-cache python3 make g++

WORKDIR /usr/code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]