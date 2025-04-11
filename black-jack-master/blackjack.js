
let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

// Blackjack Game Variables
let dealerSum = 0
let yourSum = 0
let dealerAceCount = 0
let yourAceCount = 0
let hidden
let deck

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let startButton = document.getElementById("start/new-el")
let toggleButtons = document.getElementById("toggle")
let newGameButtons = document.getElementById("toggle-new")

let cards = []
let hasBlackJack = false
let isAlive = false
let canHit = true // Allow drawing cards while sum <= 21

// Initialize the player
let player = {
    name: "Per",
    chips: 200
}
playerEl.textContent = player.name + ": $" + player.chips

window.onload = function () {
    buildDeck()
    shuffleDeck()
    resetGame()
}

// Build the deck
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let types = ["C", "D", "H", "S"]
    deck = []

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]) // A-C -> K-C, A-D -> K-D
        }
    }
}

// Shuffle the deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length)
        let temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
}

// Reset the game
function resetGame() {
    cards = []
    dealerSum = 0
    yourSum = 0
    dealerAceCount = 0
    yourAceCount = 0
    hidden = null
    hasBlackJack = false
    isAlive = false
    canHit = true
    messageEl.textContent = "Want to play a round?"
    sumEl.textContent = "Sum:"
    cardsEl.textContent = "Cards:"
    document.getElementById("your-cards").innerHTML = ""
    document.getElementById("dealer-cards").innerHTML = ""
    document.getElementById("dealer-sum").textContent = ""
    document.getElementById("your-sum").textContent = ""
    document.getElementById("results").textContent = ""
    startButton.style.display = "block"
    toggleButtons.style.display = "none"
    newGameButtons.style.display = "none"
}

// Start the game
function startGame() {
    isAlive = true
    hasBlackJack = false
    canHit = true
    hidden = deck.pop()
    dealerSum += getValue(hidden)
    dealerAceCount += checkAce(hidden)

    while (dealerSum < 17) {
        let card = deck.pop()
        addCard("dealer-cards", card)
        dealerSum += getValue(card)
        dealerAceCount += checkAce(card)
    }

    for (let i = 0; i < 2; i++) {
        let card = deck.pop()
        addCard("your-cards", card)
        yourSum += getValue(card)
        yourAceCount += checkAce(card)
    }

    messageEl.textContent = "Game started! Do you want to draw a new card?"
    renderGame()
    startButton.style.display = "none"
    toggleButtons.style.display = "block"
    newGameButtons.style.display = "none"
}

// Add a card to the player or dealer
function addCard(containerId, card) {
    let cardImg = document.createElement("img")
    cardImg.src = "./cards/" + card + ".png"
    cardImg.classList.add("card-animation")
    document.getElementById(containerId).appendChild(cardImg)
}

// Render game state
function renderGame() {
    document.getElementById("your-sum").textContent = yourSum
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false
        stay() // Auto-trigger stay if busted
    }
}

// Hit (Draw a card)
function hit() {
    if (!canHit || !isAlive) return

    let card = deck.pop()
    addCard("your-cards", card)
    yourSum += getValue(card)
    yourAceCount += checkAce(card)
    renderGame()
}

// Stay (End your turn)
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount)
    yourSum = reduceAce(yourSum, yourAceCount)

    canHit = false
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"

    let message = ""
    if (yourSum > 21) {
        message = "You Lose!"
    } else if (dealerSum > 21) {
        message = "You Win!"
    } else if (yourSum == dealerSum) {
        message = "Tie!"
    } else if (yourSum > dealerSum) {
        message = "You Win!"
    } else {
        message = "You Lose!"
    }

    document.getElementById("dealer-sum").textContent = dealerSum
    document.getElementById("results").textContent = message
    toggleButtons.style.display = "none"
    newGameButtons.style.display = "block"
}

// Get the value of a card
function getValue(card) {
    let data = card.split("-")
    let value = data[0]

    if (isNaN(value)) {
        return value === "A" ? 11 : 10
    }
    return parseInt(value)
}

// Check if a card is an Ace
function checkAce(card) {
    return card[0] === "A" ? 1 : 0
}

// Adjust the sum for Aces
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10
        playerAceCount -= 1
    }
    return playerSum
}

