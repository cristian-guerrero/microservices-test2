From node:lts-alpine

WORKDIR /app

COPY package.json .
RUN yarn 
COPY . .
# EXPOSE 4000
CMD ["yarn", "start"]

 # docker build -t guerrerocristian/auth .