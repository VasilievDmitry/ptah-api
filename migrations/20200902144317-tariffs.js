const ObjectID = require('bson-objectid');

module.exports = {
    async up(db) {
        await db.createCollection('ptah-tariffs');
        await db.collection('ptah-tariffs').createIndexes([
                {
                    "key": {
                        "isArchived": 1
                    },
                    "name": "isArchived_idx",
                },{
                    "key": {
                        "isDefault": 1
                    },
                    "name": "isDefault_idx",
                }
            ]
        );
        await db.createCollection('ptah-tariffs-history');
        await db.collection('ptah-tariffs-history').createIndexes([
                {
                    "key": {
                        "tariffId_idx": 1
                    },
                    "name": "tariffId_idx",
                }
            ]
        );
        await db.collection('ptah-tariffs').insertMany([
            {
                "_id": ObjectID("5f53ee77ea0c9a00a8c88082"),
                "createDate": "2020-09-05T20:00:55.252Z",
                "dayPrice": 0,
                "features": {
                    "5f51769630e5fb53e0b94cbd": 3,
                    "5f5176d730e5fb53e0b94cce": 50,
                    "5f53e591e36dd80b9caaf9f2": 0,
                },
                "isArchived": false,
                "isDefault": true,
                "name": "Free",
                "description": "Free tariff for beginners",
                "periodDays": 30,
                "updateDate": "2020-09-05T20:00:55.252Z"
            }
        ]);
        await db.collection('ptah-tariffs-history').insertMany([
            {
                "_id": ObjectID("5f53ee77213eda00a88adcff"),
                "createDate": "2020-09-05T20:00:55.252Z",
                "dayPrice": 0,
                "features": {
                    "5f51769630e5fb53e0b94cbd": 3,
                    "5f5176d730e5fb53e0b94cce": 50,
                    "5f53e591e36dd80b9caaf9f2": 0,
                },
                "isArchived": false,
                "isDefault": true,
                "name": "Free",
                "description": "Free tariff for beginners",
                "periodDays": 30,
                "updateDate": "2020-09-05T20:00:55.252Z",
                "tariffId": ObjectID("5f53ee77ea0c9a00a8c88082"),
                "currentUserId": ObjectID("5f516e495410f830589eb078")
            }
        ], {upsert: true});
    },
    async down(db) {
        await db.collection('ptah-tariffs').drop()
        await db.collection('ptah-tariffs-history').drop()
    }
};

