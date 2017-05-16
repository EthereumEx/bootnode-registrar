FROM node:boron

RUN git clone https://github.com/EthereumEx/bootnode-registrar.git /var/lib/bootnode
WORKDIR /var/lib/bootnode
RUN npm install

ENTRYPOINT ["node", "app.js"]
