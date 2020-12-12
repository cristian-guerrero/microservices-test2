FROM node:lts-alpine

#WORKDIR /usr/src/app
#COPY package.json .
#COPY yarn.lock .
#COPY  common/ ./common
#copy tickets/ ./tickets
#qRUN yarn install --production=true




COPY package.json .
RUN yarn install --production=true
COPY . .
CMD ["yarn", "start"]

 # docker build -t guerrerocristian/payments .

# construir desde la carpeta raiz
 # docker build -t  ticketscontainer -f tickets/Dockerfile .
