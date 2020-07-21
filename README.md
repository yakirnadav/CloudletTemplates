# Helm Chart Templates for deploying application in cloudlet
Deployment of an application in the cloudlet the smart way is done using [Helm Charts](https://helm.sh/docs/topics/charts/).
By describing the infrastructure (deployment, services,DBS, etc..) of the application with a code we are enabling our customers to deploy and maintain multi-cluster application from one place

This git repo provides templates and guides how to deploy application and other services using helm charts in the cloudlet.

In order to use these template files, you need to copy the files for each service that you want to deploy, each chart comes with demo and examples,[after copying follow the istruction to create new deployment in cloudlet](#Steps-for-deploying-new-application-in-specific-cloudlet-using-Helm-Charts):
* [Templates and guid for deploying simple web application](https://github.com/yakirnadav/CloudletTemplates/tree/master/charts/webapp)
* [Templates and guid for deploying simple web application with PostgreSQL Cluster](https://github.com/yakirnadav/CloudletTemplates/tree/master/charts/PostgreSQL%20Cluster)


## Steps for deploying new application in specific cloudlet using Helm-Charts
### 1. Creating new Cloudlet Deployment Instance 
### 2. Sync 