# Library Management System

This is an application designed to help library admins efficiently manage their resources. It
provides a user-friendly platform to borrow and return books, and manage library inventory.

## Installation
* This is a Nodejs/express application with pug in the front end.
* You need to install node on your machine
* Fork the repo at https://github.com/Irenyak1/library-mgt-system.git

### Clone the repository
* git clone https://github.com/Irenyak1/library-mgt-system.git

### Navigate to the project directory
* cd library-mgt-system

### Install dependencies
* npm install

## Usage
* Create a .env file and put in your databe url 
e.g DATABASE=mongodb://localhost:27017/"your-collection name"

### Start the server
* npm start
* The index  page of the app can be found on  http://localhost:4200/

## Deployment 
* This App is hosted on [render.com](https://library-mgt-system.onrender.com/)
* Sample login details; email: inyakate@gmail.com, password: Ilovecode@1844.


## Folder Structure
* The application is arranged in an MVC architecture for Separation of concerns and 
  also make it easier to develop, maintain, and scale the application

├── models/      # Mongoose models
├── public/      # Static assets (CSS, images, js)
├── routes/      # Express routes
├── views/       # Pug templates
├── .env         # Database configuration file 
├── .gitignore   # Git ignore file    
├── app.js       # Express server file
├── package.json # npm package file
└── README.md    # Application documentation file

## Technologies used
* express: Web framework for Node.js
* pug: Template engine for Node.js

## Author 
Irene Nyakate
