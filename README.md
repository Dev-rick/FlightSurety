* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

# Summary

* Under Development
* Flight Surety App

## Crucial point:



## Starting the MongoDB database and the connection to it

* cd to the server directory and enter in the command line in order to start the localhost:3090
````
npm run dev
````
* open a new terminal and start the MongoDB database by typing in:
````
mongod
````


## Installed packages

Following packages were additionally installed with npm --save [package]:


* Client-side
  * react-router-dom
  * redux
  * react-redux
  * redux-form
  * axios
  * redux-thunk
* Server-Side
  * express
  * mongoose
  * morgan
  * body-parser
  * nodemon
  * jwt-simple
  * passport
  * passport-jwt
  * passport-local
  * cors
* Additional installation MongoDB:
  * https://docs.mongodb.com/manual/tutorial/getting-started/
  * install the msi by clicking on it
  * ADD to your PATH variable: C:\Program Files\MongoDB\Server\4.0\bin
  * open cmd and type (to create a local store for MongoDB):
  ````
  mkdir C:\data\db
  ````
  * type in in cmd to start mongodb:
  ````
  "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"
  ````


## Make the path absolute:

* In addition, the path is absolute: create a file named '.env' in your root directory write in it:

````
 NODE_PATH=src/
````

## Notes on different packages:

### Notes on axios

To make API requests to the server

### Notes on redux-thunk

Similar to redux-promise to make asynchronous action calls

### Notes on redux-form

To handle better the signin and signup form

### Notes on redux and react-redux

To have a centralized state

### Notes on nodemon

automatically restarts our server when changes are detected
Inside the script Object of the package.json file in the server directory put:
````
"dev": "nodemon index.js"
````
and run in the command line: npm run dev

### Notes on mongoose

Mongoose enables to interface with the data base (MongoDB) in some fashion
It acts like a Middleware

### Notes on jwt-simple

jwt-simple let us create access tokens for users
I use the "sub" and "iat" property, feel free to exploit others: https://jwt.io

### Notes on passport

* passport is more like an ecosystem formed by Strategies
  * Strategy is a method for authenticating a user
  * strategy-jwt is one example using tokens from jwt
  * strategy-local is one example using email and a password
  * Check out other strategies at: http://www.passportjs.org/

### Notes on cors

* cors enables us to allow requests from different sources
