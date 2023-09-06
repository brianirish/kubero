<p align="center">
<img src="docs/logo/kubero-logo-horizontal.png">
</p>
<hr>
<br>

<a href="https://github.com/kubero-dev/kubero/blob/main/LICENSE" target="_blank"><img alt="License" src="https://img.shields.io/github/license/kubero-dev/kubero?style=flat-square&color=blue"></a>
<a href="https://github.com/kubero-dev/kubero/releases/latest" target="_blank"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/kubero-dev/kubero?style=flat-square&color=brightgreen"></a>
<a href="https://discord.gg/tafRPMWS4r" target="_blank"><img alt="Discord" src="https://img.shields.io/discord/1051249947472826408?style=flat-square"></a>
<a href="https://demo.kubero.dev" target="_blank"><img alt="Demo" src="https://img.shields.io/badge/demo-up-sucess?style=flat-square&color=blue"></a>


<br>
Kubero [pronounced: Kube Hero] is a fully self-hosted Internal Developer Platform (IDP) that brings the workflows of Heroku to your Kubernetes cluster. It enables you to deploy your applications with a few clicks on the Dashboard or by CLI. It has a built-in CI/CD pipeline and supports multiple staging environments.
<br>
<br>

<img src="docs/screenshots/createapp.gif">

More <a href="https://docs.kubero.dev/screenshots" target="_blank">Screenshots</a> and a full video on
<a href="https://www.youtube.com/watch?v=-_XcC_8cpis" target="_blank">YouTube</a><p>

## How it Works ([DEMO](https://demo.kubero.dev))
1. Create a pipeline with the phases you need (review, test, stage, production)
2. Connect the pipeline to your git repository (Github, Bitbucket, Gitlab, Gitea, Gogs)
3. Configure your apps with cronjobs and addons

Kubero will then start an init container that will clone your repository and another init container to build your app. Kubero is now able to start the container and expose it to the internet. You can now access your app via the configured domain.

## What can Kubero do for you?
- Create a CI pipeline with up to 4 separate **staging environments** for all your applications
- Build, start and cleanup **review-apps** after opening/closing a pull request
- Automatic **redeployment** of the app based on a push to a branch or tag
- Create scheduled tasks as **cronjobs**
- Deploy well known apps with **templates** (Wordpress, Grafana, ...)
- Easy deployment of your apps on Kubernetes **without helm charts**
- Deploy **add-ons** for your application (PostgreSQL, Redis, [and more ...](https://github.com/kubero-dev/kubero#how-it-works-demo))
- Easy access of **application logs** in the UI
- Easy and safe **restart** of the application in the UI
- Periodic <span style="color: MediumPurple">**vulnerability scans**</span> of your running apps

## What Kubero won't do for you
- Manage your Kubernetes cluster
- Give access to your container CLI

## Supported GIT repositories (hosted and self-hosted)
- Gitea / Forgejo
- Gogs
- Github
- Gitlab
- Bitbucket
- OneDev (planned)

## Tested languages/frameworks
Basically *everything* that can be shipped in a single container. Kubero uses official images to build and run the apps. But they can be replaced or extended to fit your needs.

- GoLang (including Hugo, gin-gonic)
- Python (including Flask)
- JavaScript/NodeJS
- PHP (including Laravel)
- Ruby (including Rails)
- Static HTML
- Rust (including Rocket)
- ...

You find the preconfigured buildpacks and examples here:
https://github.com/kubero-dev/buildpacks

## Preconfigured add-ons
The Kubero Operator ships with several basic addons that can be used in your apps.
- <img src="client/public/img/addons/MySQL.png" width="30px" style="vertical-align: middle; margin: 10px"> MySQL
- <img src="client/public/img/addons/postgresql.png" width="30px" style="vertical-align: middle; margin: 10px"> PostgreSQL
- <img src="client/public/img/addons/Redis.png" width="30px" style="vertical-align: middle; margin: 10px"> Redis
- <img src="client/public/img/addons/MongoDB.png" width="30px" style="vertical-align: middle; margin: 10px"> MongoDB
- <img src="client/public/img/addons/Elasticsearch.png" width="30px" style="vertical-align: middle; margin: 10px"> Elasticsearch
- <img src="client/public/img/addons/Kafka.png" width="30px" style="vertical-align: middle; margin: 10px"> Kafka
- <img src="client/public/img/addons/CouchDB.png" width="30px" style="vertical-align: middle; margin: 10px"> CouchDB
- <img src="client/public/img/addons/Haraka.png" width="30px" style="vertical-align: middle; margin: 10px"> Haraka Mail Server
- RabbitMQ (WIP)
- CockroachDB (WIP)
- Minio (planned)
- InfluxDB (planned)

## 50+ Application templates (similar to Heroku Buttons)
- Wordpress
- Grafana
- <a href="https://uptime.kuma.pet" target="_blank">Kuma</a>
- <a href="https://github.com/zadam/trilium" target="_blank">Trilium Notes</a>
- ...

Check out the full [list here](https://www.kubero.dev/templates/) or submit your own app! [Read here](https://github.com/kubero-dev/kubero/blob/main/services/) how to do it.

## Basic Concept 
Kubero is Kubernetes native and runs with two containers on any Kubernetes instance.
<br>
<br>

<img src="docs/img/highlevel.png">

## Quickstart
1) Download and unpack the <a href="https://github.com/kubero-dev/kubero-cli/releases/latest">Kubero CLI</a><p>
2) Run `kubero install` to install all components on an new or your existing cluster

You can bring your own cluster or create one with the kubero install on one of the following providers:
- GKE
- Scaleway
- DigitalOcean
- Linode
- Kind (local)

## Documentation
https://docs.kubero.dev/

## Roadmap
https://github.com/orgs/kubero-dev/projects/1/views/3

## Community
[![kubero Discord server Banner](https://discordapp.com/api/guilds/1051249947472826408/widget.png?style=banner2)](https://discord.gg/tafRPMWS4r)

## Contributing
All contributions are welcome!
 - Open an issue
 - Add a feature or open a feature request
 - Discuss ideas in the discussions
 - Fix typos
 - Contribute code
 - Write articles

## Supporting this project
Starring this project is a huge motivation. ⭐ Thank you!

[![Stargazers over time](https://starchart.cc/kubero-dev/kubero.svg)](https://starchart.cc/kubero-dev/kubero)
