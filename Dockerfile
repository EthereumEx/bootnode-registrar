FROM ethereumex/eth-netstats

RUN git clone https://github.com/EthereumEx/bootnode-registrar.git /var/lib/bootnode
WORKDIR /var/lib/bootnode
RUN git checkout dev/ericmai
RUN npm install

ENTRYPOINT ["/bin/bash"]]
