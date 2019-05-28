// creating this and we tell Mongoos how it should handle this model

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';


const Schema = mongoose.Schema;
// define out model

const userSchema = new Schema({
  //to enforce uniqueness we must assign it in an object and make unique true
  // lowercase makes sure that the email will be enforced to lowercase
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
})

// On save Hook, encrypt Password
// before saving this model run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;
  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err) }

      user.password = hash;
      next();
    })
  })
})


// whenever a user object is created it has access to these functions
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if (err) {return callback(err); }
        callback(null, isMatch);
    })
  }



// Create model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
export default ModelClass
