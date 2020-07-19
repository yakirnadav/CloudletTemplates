# Helm Chart Templates for deploying web application in cloudlet


This project provides template Helm Charts for deploying a  web application into any Kubernetes based cloud (Cloudlet).

The templates require your application to built into a Docker image. The [Docker Templates](http://github.com/CloudNativeJS/docker) project provides assistance in creating an image for your application.

This project provides the following files:

| File                                              | Description                                                           |
|---------------------------------------------------|-----------------------------------------------------------------------|  
| `/chart/webapp/Chart.yaml`                    | The definition file for your application                           | 
| `/chart/webapp/values.yaml`                   | Configurable values that are inserted into the following template files      |        
| `/chart/webapp/templates/deployment.yaml`     | Template to configure your application deployment.                 | 
| `/chart/webapp/templates/service.yaml`        | Template to configure your application deployment.                 | 

In order to use these template files, copy the files from this project into your application directory. You should only need to edit the `Chart.yaml` and `values.yaml` files.

## Deploying application in cloudlet


## Configuring the Chart for your Application

The following table lists the configurable parameters of the template Helm chart and their default values.

| Parameter                  | Description                                     | Default                                                    |
| -----------------------    | ---------------------------------------------   | ---------------------------------------------------------- |
| `image.repository`         | image repository                                | `<namespace>/nodeserver`                                 |
| `image.tag`                | Image tag                                       | `latest`                                                    |
| `image.pullPolicy`         | Image pull policy                               | `Always`                                                   |
| `livenessProbe`   | Configuration for any liveness probe provided |   YAML object of liveness probe. See [Liveness and Readiness Probes](#liveness-and-readiness-probes)                            |
| `readinessProbe`         | Configuration provided for any liveness probe provided      | YAML object of readiness probe. See [Liveness and Readiness Probes](#liveness-and-readiness-probes)         |
| `service.name`             | Kubernetes service name                                | `Node`                                                     |
| `service.type`             | Kubernetes service type exposing port                  | `NodePort`                                                 |
| `service.port`             | TCP Port for this service                       | 3000                                                       |
| `resources.limits.memory`  | Memory resource limits                          | `128m`                                                     |
| `resources.limits.cpu`     | CPU resource limits                             | `100m`                                                     |
