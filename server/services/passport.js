// helps us to setup the passport library in order to handle requests visiting
// sites requiring authentication

import passport from 'passport';
import User from '../models/user';
import config from '../config';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as LocalStrategy} from 'passport-local';


// 1st Strategy - Local strategy (authenticate users only given an email and a passport
// this strategy will give them a token which they can use in the future


const localOptions = {
  // transfer the email property to the key usernameField
  usernameField: 'email'

}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify this username and password, call done with the user
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      console.log('No user found');
      return done(null, false);
    }
    user.comparePassword(password, function(err, isMatch) {
      console.log('Compared Password completed');
      if (err) {return done(err)};
      if (!isMatch) {return done(null, false);}
      return done(null, user);
      })
    })
  .catch((err) => {
    return done(err);
  })
})

  // it is correct username and passport
  // otherwise call done with false





// 2nd Strategy - JWT strategy

// Setup options for Jwt Strategy
// Define explicitly where to find the key in the request as it can sit in the body
// or header
const jwtOptions = {
  //look a the header and extract the token from the key called authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // in order decode it
  secretOrKey: config.secret
};



//Create Jwt strategy

// tokens payload is the sub and iat assigned during the creation of the User
// done is a callback function if we are succesful or not
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // see if the user Id exists in our database
  User.findById(payload.sub)
  // if yes call 'done' with a user object
  .then((user) => {
    user ? done(null, user) : done(null, false)
  })
  // if not call 'done' without a user object
  .catch((err) => {return done(err, false)})

})


// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
