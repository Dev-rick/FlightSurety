import jwt from 'jwt-simple';
import User from  '../models/user';
import config from '../config';


function tokenForUser(user) {
  // do not use their email as it can change over time
  // sub --> to whom belongs the token
  // iat --> another convention JSON Web Tokens (issued at time)
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}


function signin(req, res, next) {
  //has already there email and password auth, we just need to give him a token
  //Passport gives automatically with done(null,user) assigns it to the ModelUser
  res.send({ token: tokenForUser(req.user)});
}


function signup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //check if email and password are provided
  if (!email || !password) {
    return res.status(422).send({ error: 'Please fill in an email and a password'})
  }
  // add more tests (has email an @ symbol in it etc...)

  User.findOne({ email: email})
  .then((existingUser) => {
    // If a user with email exists, return an console.error(
    if (existingUser) {
      // 422 unprocessed entity error
      return res.status(422).send({ error: 'Email does exists'});
    }
    // If a user with the email does not exists, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save()
    .then(() => {
      res.json({token: tokenForUser(user)});
    })
    .catch((err) => {
      return next(err);
    })

  })
  .catch((err) => {
    return next(err);
  })
}

export { signin, signup};
