var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var entGen = azure.TableUtilities.entityGenerator;

var storageAccountName = "mathdashstorage";
var storageAccountKey = "9blwuC7B08uVAkfCFRadLBBBaDiscZJzhYNdsJ4/gkKc2qLj+akVyoPmg3hz4+jvDOaMlWnMPXJVwirZe+sWQA==";

var globalTable = 'records';
var globalPartition = 'partition1';

/* GET records listing. */
router.get('/', function(req, res) {
    var retryOperations = new azure.ExponentialRetryPolicyFilter();
    var tableSvc = azure.createTableService(storageAccountName, storageAccountKey).withFilter(retryOperations);

    tableSvc.createTableIfNotExists(globalTable, function(error, result, response) {
        if(!error) {
            var query = new azure.TableQuery()
            .where('PartitionKey eq ?', globalPartition);

            tableSvc.queryEntities(globalTable, query, null, function(error, result, response) {
                if(!error) {
                    var filteredResults = result.entries.filter(function(entry) {
                        return entry.score && entry.level && entry.difficulty;
                    });
                    var data = filteredResults.map(function(entry) {
                        return {
                            score: entry.score._,
                            level: entry.level._,
                            difficulty: entry.difficulty._,
                            name: entry.name ? entry.name._ : 'anonymous'
                        };
                    });
                    res.json(data.sort(function(a, b) {
                        return b.score-a.score;
                    }));
                } else {
                    res.status(500).send("Error querying records");
                }
            });
        } else {
            res.status(500).send("cannot find reference to table");
        }
    });
});

/* POST a new record. */
router.post('/', function(req, res) {
    var newRecord = {
        PartitionKey: entGen.String(globalPartition),
        RowKey: entGen.String(req.body.deviceId + '-' + req.body.difficulty),
        score: entGen.Int32(req.body.score),
        level: entGen.Int32(req.body.level),
        difficulty: entGen.String(req.body.difficulty),
        name: entGen.String(req.body.name)
    };

    var retryOperations = new azure.ExponentialRetryPolicyFilter();
    var tableSvc = azure.createTableService(storageAccountName, storageAccountKey).withFilter(retryOperations);

    tableSvc.createTableIfNotExists(globalTable, function(error, result, response) {
        if(!error) {
            // Try to retrieve the entitiy
            tableSvc.retrieveEntity(globalTable, globalPartition, req.body.deviceId + '-' + req.body.difficulty, function(error, result, response) {
                if(!error){
                    // result contains the entity
                    if (result) {
                        if (req.body.score > result.score._) {
                            // new high score for this device id
                            tableSvc.updateEntity(globalTable, newRecord, function(error, result, response) {
                                if (!error) {
                                    res.status(200).send("New high score");
                                } else {
                                    res.status(500).send("Error updating record");
                                }
                            });
                        } else {
                            res.status(204).send("Higher score already achieved");
                        }
                    } else {
                        // first record in the table
                        tableSvc.insertEntity(globalTable, newRecord, function(error, result, response) {
                            if (!error) {
                                res.status(201).send("First record inserted");
                            } else {
                                res.status(500).send("Error inserting first record");
                            }
                        });
                    }
                } else {
                    tableSvc.insertEntity(globalTable, newRecord, function(error, result, response) {
                        if (!error) {
                            res.status(201).send("First record inserted");
                        } else {
                            res.status(500).send("Error inserting first record");
                        }
                    });
                }
            });
        } else {
            res.status(500).send("cannot find reference to table");
        }
    });
});

module.exports = router;
