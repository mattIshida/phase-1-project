// Globals
const dogURL = "https://dog.ceo/api/breeds/image/random"
const dataURL = "https://randomuser.me/api/?inc=gender,name,nat,location,dob&nat=us"
const dogMessages = ["\uD83D\uDC36", "\uD83D\uDC9E", 'Arf Arf!', 'WOOF!', 'Arf Arf Arf!', 'Aroooooo!!']

let currentUser;
let globalUserArr;
let filteredUserArr; 

// DOM selectors
const otherImg = document.querySelector("#other-img")
const otherName = document.querySelector("#other-name")
const otherAge = document.querySelector("#other-age")
const otherLocation = document.querySelector("#other-location")
const otherGender = document.querySelector("#other-gender")
const otherBreed = document.querySelector("#other-breed")
const likeButton = document.querySelector("#like-user")
const dislikeButton = document.querySelector("#dislike-user")
const likesNav = document.querySelector("#likes-nav")
const likesName = document.querySelector("#likes-name")
const likesImg = document.querySelector("#likes-img")
const likesAge = document.querySelector("#likes-age")
const likesGender = document.querySelector("#likes-gender")
const likesLocation = document.querySelector("#likes-location")
const likesBreed = document.querySelector("#likes-breed")
const filterUserForm = document.querySelector("#filter-user-form")
const messageForm = document.querySelector("#message-form")
const messageLog = document.querySelector("#message-log")

// Event listeners
likeButton.addEventListener("click", handleLike)
dislikeButton.addEventListener("click", handleDislike)
document.addEventListener("keydown", e => {
    if(e.code === 'ArrowRight'){
        handleLike(e)
    }
    if(e.code === 'ArrowLeft'){
        handleDislike(e)
    }
})
filterUserForm.addEventListener("submit", filterGender)
document.addEventListener('DOMContentLoaded', ()=> {
    document.querySelector("#myForm").style.display = 'block'
})
function handleMessage(e){
    e.preventDefault()
    const message = e.target['message-like'].value
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    messageElement.style.textAlign= 'right'
    messageLog.append(messageElement)
    messageElement.scrollIntoView()
    messageForm.reset()

    setTimeout(e => replyToMessage(e), 3000)
}
document.querySelector("#signup-form").addEventListener('submit', e => {
    e.preventDefault()
    document.getElementById("myForm").style.display = "none";
})
messageForm.addEventListener('submit', handleMessage)

// Event handlers

function replyToMessage(e){
    const randomIndex = Math.floor(Math.random()*dogMessages.length)
    const message = dogMessages[randomIndex]
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    messageElement.style.textAlign= 'left'
    messageLog.append(messageElement)
    messageElement.scrollIntoView()

}


function filterGender(e){
    e.preventDefault()
    const filterChoice = e.target['filter-gender'].value
    //let filteredArr;
    if(filterChoice === 'male' || filterChoice === 'female'){
        filteredUserArr = globalUserArr.filter(userObj => userObj.gender === filterChoice)
        console.log(filteredUserArr)
        if(currentUser.gender !== filterChoice){
            displayUser(filteredUserArr.find(userObj => userObj.viewed === false))
        }
    } else {
        filteredUserArr = globalUserArr
    }

}


function handleDislike(e){
    generateNextUser(e)
}

function handleLike(e){
    addUserToLikes(e)
    generateNextUser(e)
}

function addUserToLikes(e){
    const img = document.createElement('img')
    img.src = currentUser.image
    img.className = 'nav-img'
    const x = currentUser
    img.classList.add("img-thumbnail")
    img.addEventListener('click', () => renderLikesInfo(x))
    likesNav.append(img)



}

function generateNextUser(e){
    //console.log("globalUserArr: ", globalUserArr)
    //console.log("currentUserIndex: ", currentUserIndex)
    const nextUser = filteredUserArr.find(userObj => userObj.viewed === false)
    if (nextUser) displayUser(nextUser)
    else alert('No more users!')
    //if (globalUserArr[currentUser.index+1]) displayUser(globalUserArr[currentUser.index+1])
    //else alert('No more users!')
}

// Fetch functions
function getDogImgs(url, count){
    const detailedURL = url + `/${count}`
    return fetch(detailedURL)
        .then(response => response.json())
}

function getRandomData(url, gender, count){
    let detailedURL = url + `&results=${count}` //+ `&gender=${gender}`
    detailedURL = gender === undefined ? detailedURL : detailedURL + `&gender=${gender}`
    return fetch(detailedURL)
        .then(response => response.json())
}

// Render functions
function renderLikesInfo(userObj){
    //debugger
    likesName.textContent = userObj.firstName
    likesAge.textContent = userObj.age
    likesLocation.textContent = userObj.location
    likesGender.textContent = toTitleCase(userObj.gender)
    likesImg.src = userObj.image
    likesBreed.textContent = userObj.breed
}

function displayUser(userObj){
    userObj.viewed = true;
    currentUser = userObj
    otherName.textContent = userObj.firstName
    otherAge.textContent = userObj.age
    otherLocation.textContent = userObj.location
    otherGender.textContent = toTitleCase(userObj.gender)
    otherImg.src = userObj.image
    otherBreed.textContent = userObj.breed
}

// Helper functions
function fixBreedName(str){
    const arr = str.split('-').map(toTitleCase)
    if (arr.length === 1) return arr[0]
    else return `${arr[1]} ${arr[0]}`
    
}
function toTitleCase(str){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}


// Initializers
// getDogImgs(dogURL, 10)
// .then(json => {
//     //console.log(json.message)
//     otherImg.src = json.message[0]
// })

getRandomData(dataURL, undefined, 50)
.then(randoms => {
    //console.log(randoms.results)
    // otherName.textContent = json.results[0].name.first
    // otherAge.textContent = Math.floor(json.results[0].dob.age/7)
    // otherLocation.textContent = json.results[0].location.city
    // otherGender.textContent = json.results[0].gender

    getDogImgs(dogURL, 50)
    .then(dogImgs => {
        //console.log(dogImgs.message)
        //otherImg.src = json.message[0]
        const userArr = randoms.results.map((randomObj, index) => {

            let breedValue = dogImgs.message[index].replace("https://images.dog.ceo/breeds/", '').split('/')[0]
            //console.log(fixBreedName(breedValue))
            breedValue = fixBreedName(breedValue)
            const newUser = {
                firstName: randomObj.name.first,
                image: dogImgs.message[index],
                breed: breedValue,
                age: Math.floor(randomObj.dob.age/7),
                location: randomObj.location.city,
                gender: randomObj.gender,
                index,
                viewed: false
            }
            return newUser
        })
        globalUserArr = userArr
        filteredUserArr = globalUserArr
        //console.log(userArr)
        displayUser(userArr[0])
    })
})

