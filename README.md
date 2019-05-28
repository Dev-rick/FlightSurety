* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
* Following the instructions from Stephen Grider of the Udemy course: Advanced React and Redux: 2018 Edition

# Summary

* Authentication: Bringing Front and Back end together

## Crucial point:

"We learned a lot of interesting things around working with redux thunk. I want to specifically point out the fact that when we make use of redux thank you will frequently see it with this abbreviated syntax. Remember when we have this arrow function right here it all it means is that we've got one function that's returning a another function. The child function gets called with that dispatch method and dispatch allows us to manually send any number of actions we want to into our redux store when we call dispatch and passing the action the action gets sent to all of our middle weares and then forwarded on to all the reducers in our application. Inside of our Sign-Up action creator we make use of local storage to store the Jason web token that we got back from our API. Now one thing I want to mention about local storage it's kind of undecided in the web development community as to whether or not local storage is truly a secure location to put a face on web token. In theory if someone manages to execute a cross-site scripting attack on your Web site they could possibly pull the token out of local storage and then use it to impersonate that user. This is really an unsolved problem right now and when you're using js some web tokens. Well local storage is possibly one of the best possibilities there are solutions you get but it's not necessarily the end all be all solution and standards around storage of local's of Jason Webb tokens are still developing. Then inside of our require off J.S. file in our components directory I want to point out that we very very successfully reused our require off higher order component. I really encourage you to think about putting together higher order components on your own personal projects and figuring out ways to extend functionality of your simple components with higher order components that you can reuse on future projects you put together. Really this was a great example of how we put one together on an earlier project and then very easily reused it on this newer project when we were working on the last thing I want to talk about very briefly is what we just did in the last section where we imported SPSS file into our heterogeneous file. A Do people don't know this but yes create re-act up is wired to allow you to import CSSA files directly into your javascript code and create re-act up ships with some configuration for web pack that handles this in an appropriate fashion."

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
