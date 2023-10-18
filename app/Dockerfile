FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm i --legacy-peer-deps  
RUN npm run build 
EXPOSE 3000
CMD ["npm", "run", "start"]