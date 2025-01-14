FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.example .env

RUN mkdir -p /app/data && chmod 777 /app/data

EXPOSE 3000

CMD ["npm", "run", "dev"]
