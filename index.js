// Globals
const dogURL = "https://dog.ceo/api/breeds/image/random"
const dataURL = "https://randomuser.me/api/?inc=gender,name,nat,location,dob&nat=us"
const dogMessages = ["\uD83D\uDC36", "\uD83D\uDC9E", 'Arf Arf!', 'WOOF!', 'Arf Arf Arf!', 'Aroooooo!!']
const userDataURL = "https://bf-user-data.onrender.com/users"

let currentUser;
let likedUser;
let globalUserArr;
let filteredUserArr;
let myProfile; 
const msgHistory = {};

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
const userName = document.querySelector('#userName')
const userLocation = document.querySelector('#userLocation')
const userAge = document.querySelector('#userAge')
const userGender = document.querySelector('#userGender')
const userProfilePic = document.querySelector('#profilePic')
const editButton = document.querySelector("#edit")
const logOffButton = document.querySelector('#log-off')
const gender = document.querySelector('#user-gender')

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
document.querySelector("#signup-form").addEventListener('submit', e => {
    e.preventDefault()
    signUpNewUser(e)
    updateNewUser(e)
    document.getElementById("myForm").style.display = "none";
})
messageForm.addEventListener('submit', handleMessage)

editButton.addEventListener('click', editInfo)
logOffButton.addEventListener('click', logOff)

// Event handlers
function signUpNewUser(e){
    const body = {
        name: e.target["user-name"].value,
        age: e.target["user-age"].value,
        location: e.target["user-location"].value,
        gender: e.target["user-gender"].value,
        image: e.target["profile-photo"].value,
        likedUsers: [],
        msgHistory: {}
    }
    modifyUser(undefined, "POST", body)
    .then(json => {
        myProfile = json
    })
}

function handleMessage(e){
    e.preventDefault()
    const message = e.target['message-like'].value
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    messageElement.style.textAlign= 'right'
    messageLog.append(messageElement)
    messageElement.scrollIntoView()
    messageForm.reset()
    msgHistory[likedUser.index] = messageLog.innerHTML
    modifyUser(myProfile, "PATCH", {msgHistory})
    setTimeout(e => replyToMessage(e), 3000)
}

function replyToMessage(e){
    const randomIndex = Math.floor(Math.random() * dogMessages.length)
    const message = dogMessages[randomIndex]
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    messageElement.style.textAlign= 'left'
    messageLog.append(messageElement)
    messageElement.scrollIntoView()
    msgHistory[likedUser.index] = messageLog.innerHTML
    modifyUser(myProfile, "PATCH", {msgHistory})
}

function filterGender(e){
    e.preventDefault()
    const filterChoice = e.target['filter-gender'].value
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
    myProfile.likedUsers.push(currentUser)
    modifyUser(myProfile, "PATCH", {likedUsers: myProfile.likedUsers})
    const img = document.createElement('img')
    img.src = currentUser.image
    img.className = 'nav-img'
    const x = currentUser
    img.classList.add("img-thumbnail")
    img.addEventListener('click', () => renderLikesInfo(x))
    likesNav.append(img)

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'x'
    const cachedUser = currentUser
    deleteButton.addEventListener('click', ()=> {
        img.remove()
        deleteButton.remove()
        const indexToRemove = myProfile.likedUsers.findIndex(userObj => userObj.index === cachedUser.index)
        myProfile.likedUsers.splice(indexToRemove, 1)
        modifyUser(myProfile, "PATCH", {likedUsers: myProfile.likedUsers})
        
        if(cachedUser.index !== likedUser.index) {}
        else if (myProfile.likedUsers[indexToRemove]) renderLikesInfo(myProfile.likedUsers[indexToRemove])
        else if (myProfile.likedUsers[indexToRemove-1]) renderLikesInfo(myProfile.likedUsers[indexToRemove-1])
        else clearLikesInfo()

        //if(cachedUser.index === likedUser.index) clearLikesInfo()
    })
    likesNav.append(deleteButton)
}

function clearLikesInfo(){
    likesName.textContent = ""
    likesAge.textContent = ""
    likesLocation.textContent = ""
    likesGender.textContent = toTitleCase("")
    likesImg.src = "icons/genericUser.jpg"
    likesBreed.textContent = ""
    messageLog.innerHTML = ""
}

function generateNextUser(e){
    const nextUser = filteredUserArr.find(userObj => userObj.viewed === false)
    if (nextUser) displayUser(nextUser)
    else alert('No more users!')
}

function updateNewUser(e){
    newUserName = e.target["user-name"].value,
    newUserAge = e.target["user-age"].value,
    newUserLocation = e.target["user-location"].value,
    newUserGender = e.target["user-gender"].value,
    newUserImg = e.target["profile-photo"].value,
    
    userName.textContent = newUserName
    userLocation.textContent = newUserLocation
    userAge.textContent = newUserAge
    userGender.textContent = newUserGender
    userProfilePic.src = newUserImg
}

function editInfo(){
   if (userName.contentEditable === 'false'){
    userName.contentEditable = 'true'
   } else {
    userName.contentEditable = 'false'
   }
   if (userLocation.contentEditable === 'false'){
    userLocation.contentEditable = 'true'
   } else {
    userLocation.contentEditable = 'false'
   }
   if (userAge.contentEditable === 'false'){
    userAge.contentEditable = 'true'
   } else {
    userAge.contentEditable = 'false'
   }
   if (dropInfo.getElementsByTagName('select').length === 0) {
    userGender.replaceWith(gender)
   } else {
    gender.replaceWith(userGender)
    userGender.textContent = gender.value
   }
}

function logOff(){
    document.getElementById("myForm").style.display = "block";
    document.querySelector('#signup-form').reset()

}

// Fetch functions
function getDogImgs(url, count){
    const detailedURL = url + `/${count}`
    return fetch(detailedURL)
        .then(response => response.json())
}

function getRandomData(url, gender, count){
    let detailedURL = url + `&results=${count}` 
    detailedURL = gender === undefined ? detailedURL : detailedURL + `&gender=${gender}`
    return fetch(detailedURL)
        .then(response => response.json())
}

function modifyUser(profileObj, method, body){
    const config = {
        method,
        headers: {
            "Content-Type": "Application/json",
            Accept: "Application/json"
        },
        body: JSON.stringify(body)
    }
   
    const url = method === 'PATCH' ? `${userDataURL}/${profileObj.id}` : userDataURL

    return fetch(url, config)
    .then(response => response.json())
    // .then(() => {
    //     return fetch(userDataURL)
    //     .then(response => response.json())
    //     .then(json => json)
    // })
}

// Render functions
function renderLikesInfo(userObj){
    likedUser = userObj
    likesName.textContent = userObj.firstName
    likesAge.textContent = userObj.age
    likesLocation.textContent = userObj.location
    likesGender.textContent = toTitleCase(userObj.gender)
    likesImg.src = userObj.image
    likesBreed.textContent = userObj.breed
    messageLog.innerHTML = msgHistory[likedUser.index] ? msgHistory[likedUser.index] : ""
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
getRandomData(dataURL, undefined, 50)
.then(randoms => {
    getDogImgs(dogURL, 50)
    .then(dogImgs => {
        const userArr = randoms.results.map((randomObj, index) => {

            let breedValue = dogImgs.message[index].replace("https://images.dog.ceo/breeds/", '').split('/')[0]
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
        console.log(userArr)
        displayUser(userArr[0])
    })
})
