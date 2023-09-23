import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
//Importe les fonctions depuis firebase

const appSettings = {
    databaseURL: "https://playground-d4aed-default-rtdb.europe-west1.firebasedatabase.app/"
}
//creation de ma base de données
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    //met la valeur ecrite dans une variable
    push(shoppingListInDB, inputValue)
    //pousse la valeur sans la db firebase
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) 
//La fonction onValue prend deux arguments :L'emplacement dans la db + une fonction de rappel à exécuter chaque fois que les données changent
{
    if (snapshot.exists())
    //snapshot= capture  de l'état des données dans la base de données à l'emplacement spécifié.
     {
        let itemsArray = Object.entries(snapshot.val())
        //les données  sont extraites sous forme de tableau
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "La liste de course est vide"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    //item = un array qui renvooie l'id de la donnée en 0 et sa valeur en 1
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}