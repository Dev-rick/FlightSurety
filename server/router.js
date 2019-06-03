// exports a function which will be imported by server.js

// import {signup, signin} from './controllers/authentication';
// import passportService from './services/passport';
// import passport from 'passport';
import oracles from './services/oracles';
import {registerOracle} from './controllers/registerOracle';

// setting up the first route through which the request goes

// normally passport will create a cookie session but as we use tokens we don't
// want that --> session: false

// first the variable requireAuth or requireSignin is created when app.post or app.get is called
// then the created variable is sent to the the function signin in authenicaion.js

// const requireAuth = passport.authenticate('jwt', { session: false });
// const requireSignin = passport.authenticate('local', {session: false});

export default function(app) {
  app.get('/getOracles', (req, res) => {
    res.send(oracles);
  });
  app.post('/registerOracles', registerOracle);
  // when getting a file it must pass through requireAuth which holds the strategies
  // app.get('/', requireAuth, (req, res) => {
  //   res.send('Hy there');
  // });
  // app.post('/signin', requireSignin, signin)
  // //evrytime a user tries to post sth to /signup the function Authentication.signup will run
  // app.post('/signup', signup)
}


// export default function(app) {
//
//   // when a get request comes in
//   //first argument is the router
//
//   //req has a lot of data in it (e.g. where is the request coming from etc.)
//   //res is the function which gets called when we response to the request
//   //these are as arguments in here as we import them from the outside
//   //these functions are already declared in the environment of http
//   // next is for error handling
//
//
//   app.get('/', (req, res, next) => {
//     res.send(['water', 'bottle', 'phone']);
//   });
//
//
//
// }
