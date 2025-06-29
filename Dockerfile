# Step 1: Use official Node image for build stage
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Step 2: Use Nginx to serve the app
FROM nginx:alpine

COPY --from=build /app/dist/task-tracker /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
