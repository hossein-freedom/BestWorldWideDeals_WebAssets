FROM node:18-alpine

WORKDIR /BestWorldWideDeals_WebAssets/

COPY public/  /BestWorldWideDeals_WebAssets/public/

COPY src/  /BestWorldWideDeals_WebAssets/src/

COPY package.json  /BestWorldWideDeals_WebAssets/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
