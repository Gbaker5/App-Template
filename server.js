const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //went to "(todo) database", then 'find' "(todos) collection", then put documents(objects) into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //went to (todo) database, then counted all documents that have the "completed" value = false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //pass objects in array "todoItems"  into ejs template. these are KEY VALUE PAIRS - in ejs "items" = toDoItems(variable), "left" = itemsLeft(variable)
    
    //non async code
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    console.log(request)
    console.log(request.body)

    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //go to "(todo) database", then insert object into db. ("request.body.item" is the name of item from the request in the form. "thing" could literally be anything i want to name object. Completed is set to false by default
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to collection then update this specific item whos property matches the "req.body.itemFromJS" (Ex: "Get Pizza" is itenFromJS)
        $set: {
            completed: true  //change the completed value from false to true
          }
    },{
        sort: {_id: -1}, 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})