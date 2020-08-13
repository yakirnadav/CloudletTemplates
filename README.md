# Helm Chart Templates for deploying application in cloudlet
Deployment of an application in the cloudlet the smart way is done using [Helm Charts](https://helm.sh/docs/topics/charts/).
By describing the infrastructure (deployment, services,DBS, etc..) of the application with a code we are enabling our customers to deploy and maintain multi-cluster application from one place

This git repo provides templates and guides how to deploy application and other services using helm charts in the cloudlet.

In order to use these template files, you need to copy the files for each service that you want to deploy, each chart comes with demo and examples,[after copying follow the istruction to create new deployment in cloudlet](#Steps-for-deploying-new-application-in-specific-cloudlet-using-Helm-Charts):
* [Templates and guid for deploying simple web application](https://github.com/yakirnadav/CloudletTemplates/tree/master/charts/webapp)
* [Templates and guid for deploying simple web application with PostgreSQL Cluster](https://github.com/yakirnadav/CloudletTemplates/tree/master/charts/PostgreSQL%20Cluster)


## Steps for deploying new application in specific cloudlet using Helm-Charts
### 1. Go to [Cloudlet Development Application form](http://devel.cloudlet-dev.com:8080)
![Alt text](https://github.com/yakirnadav/CloudletTemplates/blob/master/img/Image1.png?raw=true)
### 2. Enter your project details and click deploy
* Project Name - The name of the porject that will appers in the edge OCP
* GIT Repo URL - The link of the code repo that has the project helm-charts
* Application Path - The specific path of the charts in the repo
* Image Name / Repository Name - The application image that will be deployed in the edge OCP
* Main Quay username - The user name of the docker registry with the application image to pull
* Main Quay Password - The password of the docker registry
* Tags for image - the specific tags to deploy to edge (* for all tags)
* Password for Openshift - The password of the edge ocp to connect (the user name is the project name using '_' instead of spaces)
![Alt text](https://github.com/yakirnadav/CloudletTemplates/blob/master/img/Image2.png?raw=true)
### 3. Select the specifit cloudlets to deploy your project to
![Alt text](https://github.com/yakirnadav/CloudletTemplates/blob/master/img/Image3.png?raw=true)
### 4. Wait for the deployment proccess to be done
With every new deployment the following action are taken:
1. A new project and credentials are beeing created in the edge openshift
2. A image mirror from the main docker registry to the edge are beeing created to sync automaticly your images to the edge
3. A new Application is beeing created in the ArgoCD for syncing the infrastrucure code from your git repo
![Alt text](https://github.com/yakirnadav/CloudletTemplates/blob/master/img/Image4.png?raw=true)
### 5. Sync the application to the edge and watch your deployment 
