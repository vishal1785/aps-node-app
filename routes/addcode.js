let express = require('express');
let router = express.Router();
const fs = require('fs');
let updater = require('jsonfile-updater');
let Q = require('q');
let fileName = 'codes.json';

router.get('/:codeKey/:codeVal', function(req, res, next) {
    
    let receivedCodeKey = req.params.codeKey;
    let receivedCodeVal = req.params.codeVal;

    addCodeToList(receivedCodeKey,receivedCodeVal)
    .then(isAdded => getResult(isAdded))
    .then(result => res.send(JSON.stringify({data : result})))
    .catch(exception => res.send(JSON.stringify({data : populateError("ERROR",exception)})))
    .done();
});

function addCodeToList(key,val){
    let deffered = Q.defer();
    console.log('adding code - ' + val);
    updater(fileName).add(key,val, function(err) {
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

function getResult(isAdded){
    let deffered = Q.defer();
    let data = populateData("SUCCESS", isAdded);
    deffered.resolve(data);
    return deffered.promise;
}

function populateData(status,isAdded){
    return {
        "status":status,
        "code-added":isAdded
    };
}

function populateError(status,err){
    return {
        "status":status,
        "error":err
    };
}

module.exports = router;
