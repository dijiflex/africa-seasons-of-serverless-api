

const MongoClient = require('mongodb').MongoClient;

const auth = {
    user: 'recipeUser',
    password: 'NLqHYhVOd1gsngPn'
}

const uri = process.env.dbConnectionString;

let db = null;

const loadDB = async () => {
    try {
        if (db) {
            return db;
        }
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            db = client.db('reciperConnector');
            // perform actions on the collection object
            // client.close();
        });

        return db;
    } catch (err) {
        console.log(err.stack);
    }

}

module.exports = async function (context, req) {
    try {
        const database = await loadDB();
        let res = '';
        // const search = (req.query.search || (req.body && req.body.name));
        const search = req.query.search;
        if (req.query.search) {
            const search = req.query.search;
            console.log(search);
            res = recipes.filter(recipe => recipe.localSoupName === search);
        } else {
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
            body: { message: error.stack }
        };
    }

}