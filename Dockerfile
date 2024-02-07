
FROM node:18

# Set the working directory in the container

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy 
COPY . .

ENV PORT=8080
EXPOSE  8080

# Command to run your application
CMD ["npm", "start"]
