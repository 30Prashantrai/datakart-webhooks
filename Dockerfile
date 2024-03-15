FROM node:18-slim

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
COPY config ./config
COPY lib ./lib
COPY plugins ./plugins
# COPY tracer.js ./
COPY index.js ./

#RUN apk add --no-cache make gcc g++ python
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000

# CMD ["node", "--inspect=0.0.0.0:9229", "index.js"]
CMD ["node", "index.js"]
