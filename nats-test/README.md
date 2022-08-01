# NATS-TEST

This is a _very small_ program to test that we are able to publish and listen on NATS.
It is not part of the ticketing app per se and only serves to test the cluster and NATS are working as well as hand-test event dispatching with tickets messages.

note: You need to have NATS-STREAMING-SERVER up and running in you k8s cluster AND you need to forward the port to the local environment from kubectl

`kubectl port-forward service/nats-srv 4222`
