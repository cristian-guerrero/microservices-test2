From node:lts-alpine
COPY package.json .
RUN yarn install --production=true
COPY . .
CMD ["yarn", "start"]

 # docker build -t guerrerocristian/orders .
