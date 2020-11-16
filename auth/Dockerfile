From node:lts-alpine

WORKDIR /app

COPY package.json .
RUN yarn install --production=true
COPY . .
# EXPOSE 4000
CMD ["yarn", "start"]

 # docker build -t guerrerocristian/auth .