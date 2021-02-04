const { MongoClient } = require('mongodb');
const config = require('../config');

let _client = null;
let _ticketsCollection = null;

async function connect() {
    return new Promise((resolve, reject) => {
        console.log('Connecting to DB ...');

        MongoClient.connect(config.MONGODB_URI, {useUnifiedTopology:true}, (err, client) => {
            if (err){
                reject(err);
            }
            else {
                console.log(' -> ok, DB connected\n');
                _client = client;
                _ticketsCollection = client.db(config.DB_NAME).collection(config.COLLECTION_NAME);
                resolve();
            }
        });
    });
}

async function getBuckets(start, end, boundaries) {
    const result = _ticketsCollection.aggregate([
        // Stage 1
        // First, limit our query to the range we were given
        { $match: {
            $and: [
                { creation_time: { $gt: start } },
                { creation_time: { $lt: end } }
            ]
        }},
        
        // Stage 2
        // Flatten tickets so that rules are no longer an array
        { $unwind: "$rules" },
        
        // Stage 3
        // Bucket all the events by the provided boundaries
        // These will either be "days" or "weeks" boundaries
        { $bucket: {
            groupBy: "$creation_time",
            boundaries,
            default: "other",
            output: {
                tickets: {
                    $push: {
                        resolution: "$resolution",
                        rule: "$rules"
                    }
                }
            }
        }},
        
        // Stage 4
        // Now that we have all the tickets grouped by the correct resolution (days/weeks) from the $bucket stage above,
        // we can use the _id of each bucket to re-group them by bucket-per-rule.
        // But, before we can do this - we need to flatten the documents again
        { $unwind: "$tickets" },
    
        // Stage 5
        // Great, now we'll do the re-grouping
        // The result of this stage will be "rules-bucket", and in the next stage we'll group each unique bucket
        // under the same rule (so that we'll end up with documents that specify multiple buckets per unique rule)
        { $group: {
            _id: { rule: "$tickets.rule", bucket: "$_id" },
            fp: {$sum: {$cond: [
                {$eq: ['$tickets.resolution', {$literal: 'FP'}]},
                1,
                0
            ]}},
            
            tp: {$sum: {$cond: [
                {$eq: ['$tickets.resolution', {$literal: 'TP'}]},
                1,
                0
            ]}},
        }},
        
        // Stage 6
        // The final regrouping we discussed in the previous stage now takes place
        { $group: {
            _id: "$_id.rule",
            numOfTickets: {
                $push: { $add: ["$fp", "$tp"] }
            },
            
            resolutions: {
                $push: {
                    fp: "$fp",
                    tp: "$tp"
                }
            }
        }},
        
        // Stage 7
        // For each "rule" document (which now includes bucket-ed ticket resolution data) - we need to translate
        // the rule-id to it's name.
        // We do this with a $lookup into the "rules" table.
        { $lookup: {
            from: 'rules',
            localField: '_id',
            foreignField: 'id',
            as: 'ruleDescription'
        }},
        
        // Stage 8
        // Last stage - we just prepare the data to display nicely for the consuming APIs
        { $project: {
            _id: 0,
            numOfTickets: 1,
            resolutions: 1,
            ruleName: { $arrayElemAt: ['$ruleDescription.name', 0] }
        }}
    ]).toArray();
    
    return result;
}

module.exports = {
    connect,
    getBuckets
};