From node:lts-alpine

WORKDIR /app

COPY package.json .
RUN yarn install
COPY . .
# EXPOSE 4000
CMD ["yarn", "dev"]

 # docker build -t guerrerocristian/client .