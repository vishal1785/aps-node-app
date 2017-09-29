let express = require('express');
let router = express.Router();
const fs = require('fs');
let updater = require('jsonfile-updater');
let Q = require('q');
let fileName = 'codes.json';

router.get('/', function(req, res, next) {
    getParsedPackage()
    .then(fileData => getResult(fileData))
    .then(result => res.send(JSON.stringify({data : result})))
    .catch(exception => res.send(JSON.stringify({data : populateError("ERROR",exception)})))
    .done();
});

function getParsedPackage(){
    let deffered = Q.defer();
    let data = JSON.parse(fs.readFileSync(fileName));
    deffered.resolve(data);
    return deffered.promise;
}

function getResult(fileData){
    let deffered = Q.defer();
    let data = populateData("SUCCESS", fileData);
    deffered.resolve(data);
    return deffered.promise;
}

function populateData(status,data){
    return {
        "status":status,
        "codes":data
    };
}

function populateError(status,err){
    return {
        "status":status,
        "error":err
    };
}

module.exports = router;
