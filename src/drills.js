require('dotenv').config()
const knex = require('knex')


const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('connection successful');

// get all items that contain text
function searchByTerm(searchTerm) {
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

//searchByTerm('steak')

// get all items paginated 
function paginatedItems(pageNumber) {

    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber -1)
    knexInstance   
        .select('name', 'price', 'category')
        .from('shopping_list')
        .offset(offset)
        .limit(productsPerPage)
        .then(result => {
            console.log(result)
        })
}

//paginatedItems(3)

////get all items added after data 
////parameter daysAgo
///////select rows with date_added that is greater than daysAgo
function itemsAddedPriorTo(daysAgo) {
    knexInstance 
        .select('name', 'price', 'category', 'date_added','checked')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })

}
//itemsAddedPriorTo(10)

///////total cost for each category
///no parameters
/////rows grouped by their category and 
//showing total price for each category 

function totalCostByCategory(){
    knexInstance
        .select('category')
        .sum('price')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

totalCostByCategory()
