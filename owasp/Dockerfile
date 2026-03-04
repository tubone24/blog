FROM node:18.12.1-buster-slim

ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "./"]
COPY ["dist", "dist"]
RUN npm install -g serve@14.1.2
CMD ["serve", "-s", "-l", "9000", "dist"]
