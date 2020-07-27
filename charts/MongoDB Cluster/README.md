# Helm Chart Templates for simple Node.JS + MongoDB Cluster

This example provides a template for a simple Node.JS application which verifies a "Connection Succeful" to it's MongoDB Databse.

The code for this application is available in ```Code``` folder.

## Usage

The following ```values.yaml``` file is used in order to define the application. some of the variables here are saved in config maps and secrets, then loaded into the container using environment variables. For use of the example template in production, see **Code/server.js** and **Code/config.js**:

```yaml
image:
  repository: quay.io/amitai333/sampleapp2
  tag: latest

namespace: node-mongodb
APPLICATION_NAME: sampleapp

# DB VARS
mongodb-cluster:
  rootPassword: "admin"
  username: admin
  password: admin
  database: sampledb
  replicaSetName: rs0
  replicaCount: 3
  global:
    namespaceOverride: mongodb-clusters
```

## How Does It Work

The Node.JS chart deploys basic kubernetes resources, and then deploys a sub chart for the MongoDB Cluster.
The Node.JS resources are:
```yaml
- Namespace # The project definition
- Service # A connection to the Node.JS container/pod port 8080
- Route # Exposure of service to the internet
- DeploymentConfig # Definition of Node.JS container/pod
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

## Connection Endpoint

The MongoDB service endpoint will be available as a private Kubernetes cluster DNS address:
```
namespace-cluster_name-headless.namespaceOverride.svc.cluster.local
Example:
node-mongodb-ocp43-prod-headless.mongodb-cluster.svc.cluster.local
```

The Node.JS connection endpoint will be available through a route at:
```
https://application_name-namespace.apps.cluster_fqdn
Example:
http://sampleapp-node-mongodb.apps.ocp43-prod.cloudlet-dev.com
```
