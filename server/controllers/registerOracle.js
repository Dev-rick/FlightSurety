import Oracle from  '../models/oracle';

function registerOracle(req, res, next) {

    console.log(req.body.name);
    const name = req.body.name;
    const firstIndex = req.body.indexes.firstIndex;
    const secondIndex = req.body.indexes.secondIndex;
    const thirdIndex = req.body.indexes.thirdIndex;
    Oracle.findOne({ name: name })
    .then((existingOracle) => {
        // If a Oracle with name exists, return an console.error(
        if (existingOracle) {
        // 422 unprocessed entity error
        return res.status(422).send({ error: 'Oracle does exists'});
        }
        // If a Oracle with the email does not exists, create and save Oracle record
        const oracle = new Oracle({
            name: name,
            indexes: {
                firstIndex: firstIndex,
                secondIndex: secondIndex,
                thirdIndex: thirdIndex
            } 
        });
        oracle.save()
        .then(() => {
            res.json(oracle);
        })
        .catch((err) => {
            return next(err);
        })
    
    })
    .catch((err) => {
        return next(err);
    })
}
    
    export { registerOracle};