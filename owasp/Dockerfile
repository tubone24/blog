FROM node:16.19.0-buster-slim

ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "./"]
COPY ["public", "public"]
RUN npm install -g serve
CMD ["serve", "-s", "-l", "9000", "public"]