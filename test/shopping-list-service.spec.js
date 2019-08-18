const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function() {

    let db
    let testItems = [
        {
            id: 1,
            name: 'Fish tricks',
            price: '13.10',
            category: 'Main',
            checked: false,
            date_added: '2016-01-16 12:00:00',
        },
        {
            id:2,
            name: 'Not dogs',
            price: '4.99',
            category: 'Snack',
            checked: true,
            date_added: '2016-01-16 12:00:00',
        },
        {
            id: 3,
            name: 'Bluffalo Wings',
            price: '5.50',
            category: 'Snack',
            checked: false,
            date_added: '2016-01-16 12:00:00',
            }
    ]
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    beforeEach(() => {
        return db
            .into('shopping_list')
            .insert(testItems)
    })

    describe(`getAllItems()`, () => {
        it(`returns all items from shopping-list database`, () => {
        //test that Shopping-list-service.getAllItems returns all items from database
        return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(testItems.map(item => ({
                    ...item,
                    date_added: new Date(item.date_added)
                })
                ))
            })
        })
    })

    describe(`insertItem()`, () => {
        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
                const newItem = {
                    id: 4,
                    name: 'Test new name',
                    price: '2.55',
                    category: 'Snack',
                    checked: false,
                    date_added: '2016-01-16 12:00:00',
                }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 4,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        checked: newItem.checked,
                        date_added: new Date(newItem.date_added),
                    })
                })
        })
    })

    describe(`getById()`, () => {
        it(`returns an item with id === id`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId -1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked,
                        date_added: new Date(thirdTestItem.date_added),

                    })
                })

        })
    })

    describe(`deleteById()`, () => {
        it(`deletes and item with a certain id`, () => {
            const idToDelete = 2
            return ShoppingListService.deleteById(db, idToDelete)
                .then(() => ShoppingListService.getAllItems(db)
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== idToDelete)
                    expect(allItems).to.eql(expected.map(item => ({
                        ...item,
                        date_added: new Date(item.date_added)
                })
                    ))
        }))
        })

    })

    describe(`updateById()`, () => {
        it(`updates an item with a certain id`, () => {
            const idToUpdate = 1
            const firstTestItem = testItems[idToUpdate-1]

            const newItemData = {
                name: 'Updated name',
                price: '19.10',
                category: firstTestItem.category,
                checked: firstTestItem.checked,
                date_added: new Date(firstTestItem.date_added)
            }

        return ShoppingListService.updateById(db, idToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idToUpdate,
                    ...newItemData,
                })
            })
            })
        })
})