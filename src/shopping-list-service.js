const ShoppingListService = {

//get
    getAllItems(knex) {
        return knex.select('*').from('shopping_list')
    },

//insert
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

//get by Id
    getById(knex, id) {
       return knex
        .select('*').from('shopping_list').where('id', id).first()
    },
//update 
    updateById(knex, id, newData) {
        return knex('shopping_list')
        .where( {id })
        .update(newData)
    },

//delete
    deleteById(knex, id) {
        return knex('shopping_list').where({ id })
        .delete()
    }

}

module.exports = ShoppingListService



