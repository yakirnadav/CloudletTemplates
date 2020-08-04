# Helm Chart Templates for simple Node.JS + MongoDB Cluster

This example provides a template for a simple Node.JS application which verifies a "Connection Succeful" to it's MongoDB Databse.

The code for this application is available in ```Code``` folder.

## Usage

The following ```values.yaml``` file is used in order to define the application. some of the variables here are saved in config maps and secrets, then loaded into the container using environment variables. For use of the example template in production, see **Code/server.js** and **Code/config.js**:

```yaml
image:
  repository: quay.io/amitai333/sampleapp2
  tag: latest

namespace: node-mongodb-sampleapp

# DB VARS
mongodb:
  APPLICATION_NAME: sampleapp
  auth:
    rootPassword: "admin"
    username: admin
    password: admin
    database: sampledb
  replicaSetName: rs0
  replicaCount: 3
  global:
    namespaceOverride: mongodb-clusters # Do not change. This is the project for all mongodb clusters
  
  # TLS variables. Ignore unless changing TLS settings
  extraFlags:
    - "--tlsMode=preferTLS"
    - "--tlsCertificateKeyFile=/certificates/sampleapp.pem"
    - "--tlsClusterFile=/certificates/sampleapp.pem"
    - "--tlsCAFile=/certificates/sampleapp.crt"
    - "--tlsAllowConnectionsWithoutCertificates"
    - "--tlsAllowInvalidCertificates"
  extraEnvVars:
    - name: MONGODB_CLIENT_EXTRA_FLAGS
      value: --ssl --tlsAllowInvalidCertificates --tlsCertificateKeyFile=/certificates/sampleapp.pem --tlsCAFile=/certificates/sampleapp.crt
  extraVolumeMounts:
    - name: cert-volume
      mountPath: /certificates
      readOnly: true
  extraVolumes:
    - name: cert-volume
      secret:
        secretName: sampleapp-certificates
  arbiter:
    extraFlags:
      - "--tlsMode=preferTLS"
      - "--tlsCertificateKeyFile=/certificates/sampleapp.pem"
      - "--tlsClusterFile=/certificates/sampleapp.pem"
      - "--tlsCAFile=/certificates/sampleapp.crt"
      - "--tlsAllowConnectionsWithoutCertificates"
      - "--tlsAllowInvalidCertificates"
    extraEnvVars:
      - name: MONGODB_CLIENT_EXTRA_FLAGS
        value: --ssl --tlsAllowInvalidCertificates --tlsCertificateKeyFile=/certificates/sampleapp.pem --tlsCAFile=/certificates/sampleapp.crt
    extraVolumeMounts:
      - name: cert-volume
        mountPath: /certificates
        readOnly: true
    extraVolumes:
      - name: cert-volume
        secret:
          secretName: sampleapp-certificates
```

## How Does It Work

The Node.JS chart deploys basic kubernetes resources, and then deploys a sub chart for the MongoDB Cluster.

(Another instance of this application is deployed as a "monitoring" service for the use of keepalive services, and is deployed with each MongoDB cluster. ignore for the purpose of this example)

The Node.JS resources are:
```yaml
- Namespace # The project definition
- Service # A connection to the Node.JS container/pod port 8443
- Route # Exposure of service to the internet
- DeploymentConfig # Definition of Node.JS container/pod
- ConfigMap # Database connection values
- Secret # Database connection Username and Password
```
The Database resources of the sub-chart are:
```yaml
- configmap.yaml 
- initialization-configmap.yaml 
- metrics-svc.yaml
- namespace.yaml
- prometheusrule.yaml
- role.yaml
- rolebinding.yaml
- secrets.yaml
- serviceaccount.yaml
- servicemonitor.yaml
- certificates.yaml # See chapter below for more information
```
----------
Replica set resources:
```yaml
- external-access-svc.yaml
- headless-svc.yaml
- pdb.yaml
- scripts-configmap.yaml
- statefulset.yaml
```
The MongoDB statefulset is used to generate a cluster instance consisting of a *replica set* using the parameters, passwords and names listed in the custom variables.

## Optional: TLS Configuration

This example uses example CRT and KEY files (`sample.crt` and `sample.pem`) inside a Kubernetes secret called `certificates.yaml` that is mounted to the `/certificates` location on a seperate volume inside the MongoDB pods AND in the node.js application, so your cluster comes pre-built with TLS (self generated) encryption which the Node.JS uses to connect to the Cluster. 

It is important to note that the example image is not packaged with the `sample.crt` and `sample.pem` files and they are loaded through a Kubernetes secrets to a seperate volume. In order to create your own custom certificates, the secret must be rebuilt.

In order to create self-signed certificates, do the following steps:

```bash
openssl genrsa -out mongoCA.key 2048

openssl req -x509 -new -subj "/CN=mongoCA" -key mongoCA.key -out mongoCA.crt

# "sampleapp" is used as the application name. It can be changed as long as server.js under the "Code" folder is updated accordingly
openssl req -new -nodes -subj "/CN=sampleapp" -keyout sampleapp.key -out sampleapp.csr

openssl x509 -req -days 365 -in sampleapp.csr -out sampleapp.crt -CA mongoCA.crt -CAkey mongoCA.key -CAcreateserial -extensions req

cat sampleapp.key sampleapp.crt > sampleapp.pem

rm -f sampleapp.csr
```

Create the kubernets secret and replace it with charts/mongodb/templates/certificates.yaml

```
oc create secret generic mycert --from-file=sampleapp.crt=sampleapp.crt --from-file=sampleapp.pem=sampleapp.pem --dry-run -o yaml > certificates.yaml
```
Copy other rows to make it look like this, without changing the data section:
```yaml
apiVersion: v1
data:
  sampleapp.crt: # Long string
  sampleapp.pem: # Long string
kind: Secret
metadata:
  name: '{{ include "mongodb.fullname" . }}-certificates'
  namespace: {{ template "mongodb.namespace" . }}
  labels: {{- include "common.labels.standard" . | nindent 4 }}
    app.kubernetes.io/component: mongodb

```

Copy certificates.yaml as node-certificates.yaml under templates/node-certificates.yaml and make it look like this:
```yaml
apiVersion: v1
data:
  sampleapp.crt: # Long String
  sampleapp.pem: # Long String
kind: Secret
metadata:
  name: node-certificates
  namespace: {{ .Values.namespace }}
```

Copy certificates.yaml as node-certificates.yaml under charts/mongodb/templates/node-certificates.yaml and make it look like this:
```yaml
apiVersion: v1
data:
  sampleapp.crt: # Long String
  sampleapp.pem: # Long String
kind: Secret
metadata:
  name: 'node-{{ include "mongodb.fullname" . }}-certificates'
  namespace: {{ template "mongodb.namespace" . }}
  labels: {{- include "common.labels.standard" . | nindent 4 }}
    app.kubernetes.io/component: mongodb
```
____
*For advanced, secure and trusted TLS settings beyond the scope of this README see the Official MongoDB Documentation.

## Connection Endpoint

The MongoDB service endpoint will be available as a private Kubernetes cluster DNS address:
```
application_name-headless.namespaceOverride.svc.cluster.local

Example:

sampleapp-headless.mongodb-clusters.svc.cluster.local
```

The Node.JS connection endpoint will be available through a route at:
```
https://application_name-namespace.apps.cluster_fqdn

Example:

https://sampleapp-node-mongodb-sampleapp.apps.ocp43-prod.cloudlet-dev.com/
```
