let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("player-sum")
let dealerSumEl = document.getElementById("dealer-sum")
let cardsEl = document.getElementById("your-cards")
let playerEl = document.getElementById("player-el")
let historyEl = document.getElementById("history-el")
let ratioEl = document.getElementById("ratio-el")

let startButton = document.getElementById("start_btn")
let toggleButtons = document.getElementById("toggle")
let newGameButtons = document.getElementById("toggle-new")

let player = {
    name: "Chips",
    chips: 10
}

let gameHistory = {
    wins: 0,
    losses: 0,
    ties: 0
}

let dealerCards = [];
let dealerSum = 0;
let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

playerEl.textContent = player.name + ": $" + player.chips

function getCardValue(card) {
    const value = card.split("-")[0]
    if (value === "A") return 11
    if (["J", "Q", "K"].includes(value)) return 10
    return parseInt(value)
}

function adjustForAce(sum, cards) {
    let aceCount = cards.filter(card => card.startsWith("A")).length
    while (sum > 21 && aceCount > 0) {
        sum -= 10
        aceCount--
    }
    return sum
}

function getRandomCard() {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const suits = ["C", "D", "H", "S"]

    const randomValue = values[Math.floor(Math.random() * values.length)]
    const randomSuit = suits[Math.floor(Math.random() * suits.length)]

    return `${randomValue}-${randomSuit}`
}

function resetGame() {
    cards = []
    dealerCards = []
    sum = 0
    dealerSum = 0
    hasBlackJack = false
    isAlive = false
    message = "Want to play a round?" 
    sumEl.textContent = "Sum: 0"
    dealerSumEl.textContent = "Dealer's Sum: 0"
    messageEl.textContent = message
    startButton.style.display = "block" 
    toggleButtons.style.display = "none" 
    newGameButtons.style.display = "none" 
    document.getElementById("your-cards").innerHTML = ""
    document.getElementById("dealer-cards").innerHTML = ""

    if (player.chips === 0) {
        messageEl.textContent = "You have no chips left! Please add more to continue."
        return
    }

    updateHistory()
}

function startGame() {
    if (player.chips <= 0) {
        messageEl.textContent = "You have no chips left! Please add more to start playing."
        return
    }

    if (player.chips < 10) {
        messageEl.textContent = "You need at least 10 chips to play!"
        return
    }

    isAlive = true
    hasBlackJack = false
    cards = [getRandomCard(), getRandomCard()]
    dealerCards = [getRandomCard(), getRandomCard()]
    sum = getCardValue(cards[0]) + getCardValue(cards[1])
    dealerSum = getCardValue(dealerCards[0]) + getCardValue(dealerCards[1])
    sum = adjustForAce(sum, cards)
    dealerSum = adjustForAce(dealerSum, dealerCards)

    if (sum === 21) {
        message = "You've got Blackjack! Want to play again?"
        hasBlackJack = true
        isAlive = false
        player.chips += 10
        gameHistory.wins++
        updateHistory()
        revealDealerCards()
        toggleButtons.style.display = "none"
        newGameButtons.style.display = "block"
    } else {
        message = "Game started! Do you want to draw a new card?"
        toggleButtons.style.display = "block"
        newGameButtons.style.display = "none"
    }

    startButton.style.display = "none"
    playerEl.textContent = player.name + ": $" + player.chips
    renderGame()
}

function renderGame() {
    document.getElementById("your-cards").innerHTML = ""
    document.getElementById("dealer-cards").innerHTML = ""

    for (let i = 0; i < cards.length; i++) {
        let cardImg = document.createElement("img")
        cardImg.src = "./cards/" + cards[i] + ".png"
        cardImg.classList.add("card-animation")
        document.getElementById("your-cards").append(cardImg);
    }

    for (let i = 0; i < dealerCards.length; i++) {
        let cardImg = document.createElement("img")
        if (i === 0 && isAlive) {
            cardImg.src = "./cards/back.png"
        }
        else {
            cardImg.src = "./cards/" + dealerCards[i] + ".png"
        }
        cardImg.classList.add("card-animation")
        document.getElementById("dealer-cards").append(cardImg)
    }

    sum = adjustForAce(sum, cards)

    sumEl.textContent = "Sum: " + sum
    dealerSumEl.textContent = isAlive ? "Dealer's Sum: ?" : "Dealer's Sum: " + dealerSum

    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "You've got Blackjack! Want to play again?"
        hasBlackJack = true
        toggleButtons.style.display = "none"
        newGameButtons.style.display = "block"
        revealDealerCards()
    } else {
        message = "You lost the game! Want to play again?"
        isAlive = false;
        toggleButtons.style.display = "none"
        newGameButtons.style.display = "block"
        revealDealerCards()
    }
    messageEl.textContent = message
}

function newCard() {
    if (isAlive && !hasBlackJack) {
        let card = getRandomCard()
        cards.push(card)

        let cardImg = document.createElement("img")
        cardImg.src = "./cards/" + card + ".png"
        cardImg.classList.add("card-animation")
        document.getElementById("your-cards").append(cardImg)

        sum += getCardValue(card)
        renderGame()

        if (sum > 21) {
            message = "You lost! Want to play again?"
            player.chips -= 10
            gameHistory.losses++
            updateHistory()
            playerEl.textContent = player.name + ": $" + player.chips
            toggleButtons.style.display = "none"
            newGameButtons.style.display = "block"
            isAlive = false
        
            if (player.chips <= 0) {
                messageEl.textContent = "You have no chips left! Please add more to continue."
            }
        }
        
    }
}

function revealDealerCards(){
    const dealerCardsDiv = document.getElementById("dealer-cards")
    dealerCardsDiv.innerHTML = ""

    for (let i = 0; i < dealerCards.length; i++) {
        let cardImg = document.createElement("img")
        cardImg.src = "./cards/" + dealerCards[i] + ".png"
        cardImg.classList.add("card-animation")
        dealerCardsDiv.append(cardImg)
    }

    dealerSumEl.textContent = "Dealer's Sum: " + dealerSum
}

function standCard(){
    if (!isAlive || hasBlackJack) return

    while (dealerSum < 17) {
        let card = getRandomCard()
        dealerCards.push(card)
        dealerSum += getCardValue(card)
        dealerSum = adjustForAce(dealerSum, dealerCards)
    }

    revealDealerCards()

    if (dealerSum > 21 || sum > dealerSum) {
        message = "You win! Want to play again?"
        player.chips += 10
        gameHistory.wins++
    } else if (sum < dealerSum) {
        message = "You lost! Want to play again?"
        player.chips -= 10
        gameHistory.losses++
    } else {
        message = "It's a tie! Want to play again?"
        gameHistory.ties++
    }

    updateHistory()

    playerEl.textContent = player.name + ": $" + player.chips
    messageEl.textContent = message
    toggleButtons.style.display = "none"
    newGameButtons.style.display = "block"
    isAlive = false

    if (player.chips <= 0) {
        messageEl.textContent = "You have no chips left! Please add more to continue."
    }
}

function addChips(amount) {
    player.chips += amount
    playerEl.textContent = player.name + ": $" + player.chips
    resetGame()
}

function updateHistory() {
    historyEl.textContent = `Wins: ${gameHistory.wins} | Losses: ${gameHistory.losses} | Ties: ${gameHistory.ties}`
    
    const totalGames = gameHistory.wins + gameHistory.losses + gameHistory.ties
    const winRate = totalGames > 0 ? ((gameHistory.wins / totalGames) * 100).toFixed(1) : 0
    ratioEl.textContent = `Win Rate: ${winRate}%`
}

resetGame()