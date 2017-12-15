# bootnode-registrar

# Registrar Authentication

Blog posts to help with concepts:

- http://nategood.com/nodejs-ssl-client-cert-auth-api-rest
- https://geekflare.com/openssl-commands-certificates/
- https://dst.lbl.gov/~boverhof/openssl_certs.html

## Certificates

Generate certificates (self-signed test certs). Place the `ca` and `server` certs into a certs folder and reference them from the `app.js` file. The client certs must be given to the client so that it can connect.

```
# generate CA
openssl req -new -x509 -days 365 -keyout ca-key.pem -out ca.pem

# generate server cert/key pair
openssl genrsa -out server-key.pem 4096 
openssl req -new -sha256 -key server-key.pem -out server-csr.pem
openssl x509 -req -days 365 -in server-csr.pem -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

# generate client cert/key pair
openssl genrsa -out client-key.pem 4096 
openssl req -new -sha256 -key client-key.pem -out client-csr.pem
openssl x509 -req -days 365 -in client-csr.pem -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out client-crt.pem
```

Ensure that the fingerprint of the client cert is captured so that it can be added to the whitelist. This is referenced in the `app.js` file.

```
# get fingerprint of client cert for whitelisting
openssl x509 -in client-crt.pem -noout -fingerprint
```

Test Registrar client authentication

```
export CERTIFICATE_AUTH_ENABLED=1
export CERTIFICATE_BASEPATH=/root/bootnode-registrar/certs/
export WHITELIST_FILEPATH=/root/bootnode-registrar/whitelist/allowed.json
``` 

Test client authentication 

```
# add node to Registrar
curl -v -s -k -X POST -H 'Content-Type: application/json' --data '{"network":"abc","port":"8000","ip":"1.2.3.4","enode":"e124","publicIp":"4.3.2.1"}' --key certs/client-key.pem --cert certs/client-crt.pem https://localhost:443

# get list of nodes from Registrar
curl -v -s -k --key certs/client-key.pem --cert certs/client-crt.pem https://localhost:443

```

## Kubernetes

**Enable**

You can enable client certificate auth by setting the `CERTIFICATE_AUTH_ENABLED` environment variable to 1. Ensure that this environment variable is set for the container in the pod.

**Certificates**

You will need to add the ca and server certificates to a volume that can be accessed via the container. This can be done by adding the certs to a Kubernetes secret and mounting the secret as a volume. See [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) for details.

By default, the `/certs` folder will be used as the certificate location. You can override this location using the `CERTIFICATE_BASEPATH` environment variable.

**Whitelisting**

Add the whitelist of certificate fingerprints as a Kubernetes ConfigMap that is mounted to a volume in the pod. See [Kubernetes ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) for details.

By default, the `/whitelist/allowed.json` file will be used as the whitelist file. You can override this file using the `WHITELIST_FILEPATH` environment variable. There is an example file in this repo (`whitelist/allowed.json`) to show the format required.