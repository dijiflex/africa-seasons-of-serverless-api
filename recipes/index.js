

const MongoClient = require('mongodb').MongoClient;


const uri = process.env.dbConnectionString;

let db = null;

const loadDB = async () => {
    try {
        if (db) {
            return db;
        }
        const client = await new MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = await client.db('reciperConnector');

        return db;
    } catch (err) {
        console.log(err.stack);
    }

}

module.exports = async function (context, req) {
    try {
        //Call the dabase connection
        const database = await loadDB();
        let res = '';

        const search = req.query.search;
        if (req.query.search) {
            //Get the search query string
            const search = req.query.search;
            res = await database.collection('recipes').aggregate([{
                '$search': {
                    'autocomplete': {
                        'query': `${search}`,
                        'path': 'localSoupName',
                        'fuzzy': {
                            'maxEdits': 2
                        }
                    }
                }
            }
            ]).toArray();

        } else {
            //Return all the recipes
            res = await database.collection('recipes').find().toArray();
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: res
        };
    } catch (error) {
        context.log(`Error code: ${error.code} message: ${error.message}`)
        context.res = {
            status: 500, /* Defaults to 200 */
            body: { message: error.message, stack: error.stack }
        };
    }

}