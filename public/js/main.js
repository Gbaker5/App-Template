const deleteBtn = document.querySelectorAll('.fa-trash')//all elements with this trash class
const item = document.querySelectorAll('.item span') //all spans within the 'item' class
const itemCompleted = document.querySelectorAll('.item span.completed') //all spans within the 'item' class which also has the class 'completed

//add event listener for each "delete" button created via ejs
Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem)
})

//add event listener for each "Mark complete" button created via ejs
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//add event listener for each "mark uncomplete" button created via ejs
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //select speceific "delete button" that you have clicked on (selected through dom)
    try{
        const response = await fetch('deleteItem', { //send delete item request to server.js
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //select specific text item from dom and store in variable
    try{
        const response = await fetch('markComplete', { //send a fetch request sent to "app.put('mark complete')" on server-side.
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //"itemFromJS" = item name from dom  (Ex: "Get Pizza" see server.js-'Mark Complete')
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}