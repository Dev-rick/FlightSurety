// creating this and we tell Mongoos how it should handle this model

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
// define out model

const oracleSchema = new Schema({
  //to enforce uniqueness we must assign it in an object and make unique true
  // lowercase makes sure that the email will be enforced to lowercase
  name: {
    type: String,
    unique: true,
    lowercase: true
  },
  indexes: {
      firstIndex: {type: Number},
      secondIndex: {type: Number},
      thirdIndex: {type: Number}
  } 
})


// whenever a user object is created it has access to these functions
// don't use arrow function as the this keyword will not work
oracleSchema.methods.compareIndexes = async function(indexesRequested) {
    const oracle = this;
    console.log(oracle);
    // compare indexes
    let isMatch = false;
    let indexesOfOracle = Object.values(oracle.indexes)
    for (let i = 0; i < indexesOfOracle.length; i++) {
      isMatch = indexesOfOracle[i] === indexesRequested ? true : false;
      if (isMatch) {
        break;
      }
    }
    return isMatch;
  }


// Create model class
const ModelClass = mongoose.model('oracle', oracleSchema);

// export the model
export default ModelClass
