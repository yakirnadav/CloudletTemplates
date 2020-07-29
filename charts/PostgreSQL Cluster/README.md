# Helm Chart Templates for simple Node.JS + PostgreSQL Cluster

The Crunchy PostgreSQL Operator automates and simplifies deploying and managing open source PostgreSQL clusters on Kubernetes and other Kubernetes-enabled Platforms by providing the essential features you need to keep your PostgreSQL clusters up and running.

This example provides a template for a simple Node.JS application which verifies a "Connection Succeful" to it's PostgreSQL Databse.

The code for this application is available in ```Code``` folder.

## Usage

The following ```values.yaml``` file is used in order to define the application. some of the variables here are saved in config maps and secrets, then loaded into the container using environment variables. For use of the example template in production, see **Code/server.js** and **Code/config.js**:

```yaml
image:
  repository: quay.io/amitai333/sampleapp # Do not change
  tag: latest # Do not change

namespace: node-postgres # Your project name

# DB VARS
pgcluster:
  PG_STORAGE_SIZE: 1G # DB storage size request
  PG_REPLICAS: "2" # Replicas (secondaries). 2 recommnded.
  PG_CLUSTER_NAME: "sampleapp" # Replica set name
  PG_DATABASE_NAME: "sampledb" # Database name used by your app
  DB_USERNAME: myuser # DB Administrator user name
  DB_PASSWORD: password # DB Administrator password

  PG_STORAGE_CLASS: managed-premium # Do not change, Ask Cloud provider for information about this value.
  PG_IMAGE_NAME: crunchy-postgres-ha # Do not change
  PG_IMAGE_TAG: centos7-12.2-4.3.0 # Do not change
  PG_NAMESPACE: "pgo" # Do not change
  PG_PGO_VERSION: 4.3.0 # Do not change
```

## Generating Custom TLS Certificates (Optional)

This example uses example CRT and KEY files inside TLS secrets, so your cluster comes pre-built with TLS (self generated) encryption.
If you want to change the TLS security of your database connection to have different certificates, create the CRT and KEY files (or obtain them using קב"ם), and then secrets YAML. Replace the YAMLs with the example ```postgresql-ca.yaml``` and ```hacluster-tls-keypair.yaml``` inside **charts/pgcluster/templates**:

```bash
# Replace itterations of "mycluster" with your cluster_name

openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN=mycluster.pgo.svc.cluster.local"

chmod og-rwx server.key

kubectl create secret generic mycluser-postgresql-ca --from-file=ca.crt=./server.crt --dry-run -o yaml > postgresql-ca.yaml

kubectl create secret tls mycluser-hacluster-tls-keypair --cert=./server.crt --key=./server.key --dry-run -o yaml > hacluster-tls-keypair.yaml
```

(Don't forget to add *namespace* row inside secret in the following fasion):
```yaml
hacluster-tls-keypair.yaml

metadata:
  name: "{{.Values.PG_CLUSTER_NAME}}-hacluster-tls-keypair"
  namespace: "{{.Values.PG_NAMESPACE}}"

postgresql-ca.yaml

metadata:
  name: "{{.Values.PG_CLUSTER_NAME}}-postgresql-ca"
  namespace: "{{.Values.PG_NAMESPACE}}"
```


## How Does It Work

The Node.JS chart deploys basic kubernetes resources, and then deploys a sub chart for the PostgreSQL Cluster.

(Another instance of this application is deployed as a "monitoring" service for the use of keepalive services, and is deployed with each PostgreSQL cluster. ignore for the purpose of this example)

The Node.JS resources are:
```yaml
- Namespace # The project definition
- Service # A connection to the Node.JS container/pod port 8080
- Route # Exposure of service to the internet
- DeploymentConfig # Definition of Node.JS container/pod
```
The Database resources of the sub-chart are:
```yaml
- backrest-repo-config.yaml # Backup variables
- myuser-secret.yaml # Basic user login data
- pgcluster.yaml # PostgreSQL custom kubernetes resource
- postgres-secret.yaml # Postgres user login data
- primaryuser-secret.yaml # Primary user login data
- postgresql-ca.yaml # Certificate authority secret
- hacluster-tls-keypair.yaml # SSL keys secret
```
The pgcluser CRD is used to generate a cluster instance using the parameters, passwords, certificates and names listed in the custom variables.

## Connection Endpoint

The postgresql service endpoint will be available as a private Kubernetes cluster DNS address:

```
Example:
mycluster.pgo.svc.cluster.local
```

The Node.JS connection endpoint will be available through a route at:
(This uses the *Namespace,PG_CLUSTER_NAME* variables)

```
https://application_name-namespace.apps.cluster_fqdn
Example:
https://sampleapp-node-postgres.apps.ocp43-prod.cloudlet-dev.com/
```
