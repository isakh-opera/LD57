FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install &&  npm run build

EXPOSE $PORT

ENTRYPOINT ["npm", "run", "start"]