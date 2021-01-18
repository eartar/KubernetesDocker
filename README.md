# KubernetesDocker
Me messing around with Docker for the first time.

This is for me as a cheat sheet when i get confused about things, otherwise has no value whatsoever :)

If you really, really want to see whats going on, see it in "Raw View" in github.

## Cheat sheet for myself
@Myself: Don't forget about https://github.com/eartar/KubernetesMongoDB

kubectl get services

kubectl create deployment nginx-depl --image=nginx

CRUD ops

kubectl edit deployment nginx-depl
if edited, the pod will be terminated
in this case the replicaset wont have any running pods
A new replicaset and pod will be created
kubectl get pod
kubectl get replicaset

kubectl describe pod mongo-depl
clean output of whats going on with the pod. Events etc

kubectl exec -it mongo-depl-5fd6b7d4b4-zjjkx -- bin/bash
interactive terminal of this pod

kubectl apply -f nginx-deployment.yaml
set deployment file, changed deployment doesnt kill the previous pod


in yaml
spec:selector:key:val
is matced with deployment yaml

kubectl get pod -o wide
to get ip adress of pods
can use
kubectl describe service mongodb-service
to compare if ports are correctly routed


kubectl get deployment nginx-deployment -o yaml
gets yaml output from etcd for deployment

secret must be created before deployment also configmap
secret has username and password in base64 encoding

kubectl apply -f .\mongodb-secret.yaml

kubectl get all | select-string mongodb
or grep for unix to filter for mongodb stuff

config map is centralized

kubectl get pod --watch
semi-realtime updates

type: LoadBalancer -> assigns service an external IP address so it can accept external requests
requires nodeport under ports, which is between 30k-32767


namespaces
kube-system
- system processes
- master and kubectl

kube-public
- configmap
kubectl cluster-info

kube-node-lease
- heartbeats of nodes
- availablility of node

default
- yeah, default.

kubectl create namespace asdasfksakd
or with namespace config file

why namespaces?
have namespaces like database, monitoring, elastic stack, nginx-ingress etc
multiple teams, so no overrides. also can give access rights
to seperate staging and development environments
blue(current)/green(next) deployment
can limit namespace resources cpu, ram, storage..

*you cant access most resources from another namespace
- configmap
- secret

can access
- service (mysql-service.database)
				svc			ns

kubectl api-resources --namespaced=false
kubectl api-resources --namespaced=true
some things are no namespaceable, always global
- vol
- node

kubectl get configmap
is same as
kubectl get configmap -n default


kubectl apply -f mysql-configmap.yaml --namespace=asjasd creates the file in the namespace
or use a configuration file metadata:namespace:sdkf

kubens helps you swap between namespaces


ingress
wo ingress; you create an external server port, but the final product shouldnt have ip port in link
so you use ingress.
keep service internal, let ingress route external req to internal service

spec:rules: the .com domain
spec:http:paths: /.. url

an ingress controller pod is needed
controller is;
- to evaluate rules & redirections
- is the entrypoint to cluster
- third party implementations (kubernetes' one is Nginx Ingress Controller)

cluster architecture
for aws/gcloud

one of the common strategies for aws/gcloud;
Cloud Provider's Load balancer should redirect to ingress controller
No need load balancer implementation yourself

w/o cloud provider;
have an external proxy server with public ip as an etrypoint to cluster through the ingress controller
k8s cluster should not be accessible from outside

minikube addons enable ingress
starts nginx k8s controller

helm is a package manager for k8s yaml files
for things like elastic search, the yaml files are bundled in a helm repo
db,monitoring apps etc

helm hub
helm search chart-name
helm install chart-name

helm is a templating engine
configs are mostly the same for deployment and services
instead of having different yaml files for these, with helm you can define a common blueprint
and have dynamic values replaced by placeholders

Create own chart to deploy through different environments such as dev, staging, prod

Chart.yaml -> metadata
values.yaml -> values for templates
charts -> chart dependencies on other charts
templates -> yaml files



Data persistance:
k8s doesnt have data persistence out of the box
the data volumes must not depend on pod lifecycle, be avialable on all nodes, and survive cluster crashes

Persistent volume
needs actual physical storage area from local/cloud/nfs
not namespaced
local is problematic, since they live inside the cluster

persistent volume claim
"claims" a storage volume and its characteristics, and matches the volume that matches this claim
pods references this pvc under volumes:persistentVolumeClaim:claimName:
claim should be in same namespace since pods need to reference it


storage class
dynamic persistent volumes when PVC claims it
uses a yaml file
provisioner: which provisioner to use for the targeted cloud storage
parameters: storage parameters



StatefulSet

stateful apps: anything that stores data and tracks state wrt the stored data

stateless apps use deployment
stateful apps use statefulset

why need stateless?
scaling java apps is not problematic
- they are identical, interchangeable
- order doesnt matter
- one service load balances any pod

scaling mysql pod replicas is problematic:
- they are not identical, their identities matter
- addresses matter
- same spec but not interchangeable - if a pod dies, it can only be replaced with another pod with the same identity

ex:
master(rw) and slave (r) pods
data sync between master and slave

stateful apps:
pods should keep pod state, if pod dies, same pod state reattaches to restarted pod
pods have sticky identities due to this
- can retain state
- can retain endpoint

