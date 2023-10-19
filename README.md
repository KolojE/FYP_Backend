# Environmental Reporting System

This repository contains the backend codebase for my Final Year Project, an Environmental Reporting System. This system is designed to facilitate the collection, management, and visualization of environmental data. It leverages the MERN stack (MongoDB, Express.js, React Native, and Node.js) to ensure robust performance and scalability.

[Click Here for Frontend Repo](https://github.com/KolojE/FYP_MobileApp)

## Table of Contents

- [Objectives](#overview)
- [Features](#features)
- [Technologies/Libraries Used](#technologieslibraries-used)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)

## Overview

The purpose of this project is to create an automated reporting system that aims to help in managing the environmental incidents reporting system for the public and environmental incidents documenting system for organizations. 

## Features

- User authentication and authorization.
- Data visualization.
- Report the environmental incident.
- Track submitted report status.
- Update system setting.
- Report form customization.
- Review incident report.
- Incident report analysis.
- Generate summary report.
- In-app chat.

## Technologies/Libraries Used

- MongoDB
- Express.js
- React Native
- Node.js
- [JOI.js (Data Validator)](https://joi.dev/)
- Socket.io


## Getting Started

## Setting Up the Backend

You can choose to set up the backend in one of two ways:

### Option 1: Using Docker

If you prefer using Docker for containerized development, follow these steps:
install docker and docker-compose then in console:

```console
docker-composer up
```

### Option 2: Local Setup

If you'd like to set up the backend locally, follow these steps:
install mongo or use mongo atlas and change the database url in .env 

e.g. 
With [mongo atlas](https://www.mongodb.com/docs/manual/reference/connection-string/)
```console
DB_CONN_STRING="mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]"
```

Install Dependencies 
```console
npm install
```
Compile Typescript and Run The Development Server

```console
npm run dev
```

## Database Schema

![alt text](https://github.com/KolojE/FYP_Backend/blob/main/ERD.png?raw=true)

