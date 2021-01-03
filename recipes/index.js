
const recipes =  require('./recipes.json');


module.exports = async function (context, req) {
    let res = '';
    // const search = (req.query.search || (req.body && req.body.name));
    const search = req.query.search;
    if(req.query.search){
        const search = req.query.search;
        res = recipes.filter(recipe => recipe.localSoupName === search);
    } 

    

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res || recipes
    };
}