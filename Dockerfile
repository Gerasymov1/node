FROM --platform=linux/arm64/v8 node:alpine3.11
WORKDIR /usr/code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]