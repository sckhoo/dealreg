FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
COPY timezone /etc/timezone
ENV TZ Asia/Kuala_Lumpur
RUN npm install 
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
