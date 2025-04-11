let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let historyEl = document.getElementById("history-el")
let ratioEl = document.getElementById("ratio-el")

let startButton = document.getElementById("start/new-el")
let toggleButtons = document.getElementById("toggle")
let newGameButtons = document.getElementById("toggle-new")

let player = {
    name: "Per",
    chips: 200
}

let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1
    return randomNumber > 10 ? 10 : randomNumber === 1 ? 11 : randomNumber
}

function resetGame() {
    cards = []
    sum = 0
    hasBlackJack = false
    isAlive = false
    message = "Want to play a round?" 
    cardsEl.textContent = "Cards:"
    sumEl.textContent = "Sum:"
    messageEl.textContent = message
    startButton.style.display = "block" 
    toggleButtons.style.display = "none" 
    newGameButtons.style.display = "none" 
    document.getElementById("your-cards").innerHTML = "" // Clear player cards
    document.getElementById("dealer-cards").innerHTML = "" // Clear dealer cards
}

function startGame() {
    isAlive = true
    hasBlackJack = false
    cards = [getRandomCard(), getRandomCard()]
    sum = cards[0] + cards[1]
    message = "Game started! Do you want to draw a new card?"
    renderGame()
    startButton.style.display = "none"
    toggleButtons.style.display = "block"
    newGameButtons.style.display = "none"
}

function renderGame() {
    // Clear player cards first to avoid duplication
    document.getElementById("your-cards").innerHTML = ""

    cardsEl.textContent = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        let cardImg = document.createElement("img")
        cardImg.src = "./cards/" + cards[i] + ".png"
        cardImg.classList.add("card-animation") // Add animation class
        document.getElementById("your-cards").append(cardImg)

        cardsEl.textContent += cards[i] + " "
    }

    sumEl.textContent = "Sum: " + sum

    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "You've got Blackjack! Want to play again?"
        hasBlackJack = true
        toggleButtons.style.display = "none" 
        newGameButtons.style.display = "block"
    } else {
        message = "You lost the game! Want to play again?"
        isAlive = false
        toggleButtons.style.display = "none" 
        newGameButtons.style.display = "block"
    }
    messageEl.textContent = message
}

function newCard() {
    if (isAlive && !hasBlackJack) {
        let card = getRandomCard()
        cards.push(card)

        let cardImg = document.createElement("img")
        cardImg.src = "./cards/" + card + ".png"
        cardImg.classList.add("card-animation") // Add animation class
        document.getElementById("your-cards").append(cardImg)

        sum += card
        renderGame()
    }
}
resetGame()
