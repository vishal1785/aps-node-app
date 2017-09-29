let express = require('express');
let router = express.Router();
const fs = require('fs');
let updater = require('jsonfile-updater');
let Q = require('q');
let fileName = 'codes.json';

router.get('/:code', function(req, res, next) {
    
    let receivedCode = req.params.code;
    let doesCodeExists = false;
    let pkg = getParsedPackage();
    let keys = Object.keys(pkg);
    for (var i = 0; i < keys.length; i++) {
       if(receivedCode === pkg[keys[i]]){
            console.log('code found in file');
            doesCodeExists = true;
            removeCodeFromList(keys[i])
            .then(isDeleted => getResult(isDeleted))
            .then(result => res.send(JSON.stringify({data : result})))
            .catch(exception => res.send(JSON.stringify({data : populateError("ERROR",exception)})))
            .done();
       }
    }
    if(!doesCodeExists){
        res.send(JSON.stringify({data : populateError("ERROR","Code Not Found")}));
    }
});

function removeCodeFromList(code){
    let deffered = Q.defer();
    console.log('removing code - ' + code);
    updater(fileName).delete(code, function(err) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            deffered.reject(err);
        }
        deffered.resolve(true);
    });
    return deffered.promise;
}

function getParsedPackage() {
    return JSON.parse(fs.readFileSync(fileName))
}

function getResult(isDeleted){
    let deffered = Q.defer();
    let data = populateData("SUCCESS", isDeleted);
    deffered.resolve(data);
    return deffered.promise;
    //return populateData("SUCCESS", isDeleted);
}

function populateData(status,isDeleted){
    return {
        "status":status,
        "code-exists":isDeleted
    };
}

function populateError(status,err){
    return {
        "status":status,
        "error":err
    };
}

module.exports = router;
