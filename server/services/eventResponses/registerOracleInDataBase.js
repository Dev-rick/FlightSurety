import Oracle from  '../../models/oracle';

module.exports = (decodedData) => {
    Oracle.findOne({ name: decodedData[0] })
    .then((existingOracle) => {
        // If a Oracle with name exists, return an console.error(
            if (existingOracle) {
                // 422 unprocessed entity error
                return console.log('Error: Oracle does exists');
            }
            // If a Oracle with the email does not exists, create and save Oracle record
            const oracle = new Oracle({
                name: decodedData[0],
                indexes: {
                    firstIndex: decodedData[1],
                    secondIndex: decodedData[2],
                    thirdIndex: decodedData[3]
                } 
            })
            console.log("Following oracle will be saved to database:", oracle);
            oracle.save()
            .then(() => {
            console.log("Successfully saved oracle in database");
            // res.json(oracle);
        })
        .catch((err) => {
            console.log(err);
            return next(err);
        })
        
    })
    .catch((err) => {
        console.log(err);
        return next(err);
    })
}