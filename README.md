# Ticketing

This app is my version of the excellent course from Stephen Grider _Microservices with NodeJS and React_ on udemy. (https://www.udemy.com/course/microservices-with-node-js-and-react)

Note: Last tested on Windows 10 (August 2022)

## Requirements

- node v.
- npm v.
- docker desktop v.
- skaffold cli v.

## Before running cluster

`npm install`

### Note: you must initialize secrets in your cluster, here I use kubectl from-literal but any way you prefer should work

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=[THE KEY]`

`kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=[THE KEY]`

You can get your stripe key in API Keys in the Developers section of your stripe account

## Running cluster

`skaffold dev`

this might take quite a long time and you might have to restart the process a few time as docker desktop is not 100%...

# Quick overview of the architecture

![](_docs/architecture.png)
