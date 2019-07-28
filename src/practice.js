require('dotenv').config()
const knex = require('knex')


const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('connection successful');

//knexInstance.from('amazong_products').select('*')
  //  .then(result => {
   //     console.log(result)
  //  })

const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({ name: 'Point of view gun'})
    .first()
    .toQuery()
   // .then(result => {
    //    console.log(result)
    //})

  //  console.log(qry)


function searchByProduceName(searchTerm) {
    knexInstance 
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
        console.log(result)
    })
}

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page -1)
    knexInstance 
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })

}

//searchByProduceName('holo')
//paginateProducts(2)

function getProductsWithImages() {
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
            console.log(result)
        })
}

//getProductsWithImages()

function mostPopulatVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            {column: 'region', order: 'ASC'},
            { column: 'views', order: 'DESC'},
        ])
        .then(result => {
            console.log(result)
        })

}

mostPopulatVideosForDays(30)