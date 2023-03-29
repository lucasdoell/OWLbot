ARG NODE_ENV

FROM node:19

WORKDIR /apps/server

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]

EXPOSE 8080
