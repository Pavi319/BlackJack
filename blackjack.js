//
// Blackjack
// 
//
var playerCards;
var dealerCards;
var ganeOver;
var playerWon;
var deck;
var playerScore;
var dealerScore;
var aceExistence = false;
var playerCardString;
var dealerCardString;


    let newG = document.getElementById("new");
    newG.style.display = 'none';

    let start = document.getElementById("start");

    let stop = document.getElementById("stop");
    stop.style.display = 'none';

    let hit = document.getElementById("hit");
    hit.style.display = 'none';
    textArea = document.getElementById('text-area');
    resultArea = document.getElementById('result-area');

newG.addEventListener('click', function () {
    startGame();
});

start.addEventListener('click', function () {
    startGame();
});
function startGame() {
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    playerCardString = 'Player has: <br>';
    dealerCardString = 'Dealer has: <BR>';
    ganeOver = false;
    playerWon = false;
    resultArea.innerHTML = '';
    start.style.display = 'none';
    stop.style.display = 'inline';
    hit.style.display = 'inline';
    newG.style.display = 'none';
    deck = createDeck();
    playerCards.push(cardDeal(deck));
    playerCards.push(cardDeal(deck));
    dealerCards.push(cardDeal(deck));
    dealerCards.push(cardDeal(deck));

    textArea.innerHTML = ' ';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += playerCards[i] + "<br>";
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += dealerCards[i] + "<br>";
    }
    for (let i = 0; i < playerCards.length; i++) {
        playerScore += scoreCalc(playerCards[i]);
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerScore += scoreCalc(dealerCards[i]);
    }
    textArea.innerHTML = playerCardString +
        '(Score : ' + playerScore + ')' + '<br><br>' +
        dealerCardString + '(Score : ' + dealerScore + ')';
}


stop.addEventListener('click', function () {
    stop.style.display = 'none';
    hit.style.display = 'none';
    newG.style.display = 'inline';
    dealerPlays();
});

function dealerPlays() {
    while (dealerScore <= 21) {
        if (dealerScore < playerScore) {
            textArea.innerHTML = ' ';
            dealerCards.push(cardDeal(deck));
            dealerScore = updateScore(dealerCards[dealerCards.length - 1], dealerScore);
            console.log(dealerScore);
            dealerCardString += dealerCards[dealerCards.length - 1] + '<br>';
            textArea.innerHTML = playerCardString +
                '(Score : ' + playerScore + ')' + '<br><br>' +
                dealerCardString + '(Score : ' + dealerScore + ')';
        } else {
            resultArea.innerHTML = 'The dealer wins!'
            break;
        }
    }
    gameWinner(dealerScore);
}

function createDeck() {
    var deck = [];
    var signs = ["Hearts", "Spades", "Diamonds", "Clubs"];
    var value = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

    for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < signs.length; j++) {
            deck.push(value[i] + " of " + signs[j]);
        }
    }
    return deck;
}


function aceCase(count) {
    if ((count + 11) <= 21)
        count += 11;
    else
        count += 1;
    aceExistence = true;
    return count;

}


function gameDecision(count) {
    if (count == 21) {
        return true;
    } else {
        return false;
    }
}

hit.addEventListener('click', function () {
    textArea.innerHTML = ' ';
    playerCards.push(cardDeal(deck));
    playerCardString += playerCards[playerCards.length - 1] + '<br>';
    playerScore = updateScore(playerCards[playerCards.length - 1], playerScore);
    textArea.innerHTML = playerCardString +
        '(Score : ' + playerScore + ')' + '<br><br>' +
        dealerCardString + '(Score : ' + dealerScore + ')';
    gameWinner(playerScore);
});

function gameWinner(score) {
    if (score >= 21) {
        if (gameDecision(score) == true) {
            resultArea.innerHTML = 'The player wins!'
            newGame();
        } else {
            resultArea.innerHTML = 'The dealer wins!'
            newGame();
        }
    }
}

function newGame() {
    stop.style.display = 'none';
    hit.style.display = 'none';
    newG.style.display = 'inline';

}

function updateScore(myCard, myScore) {
    let updatedScore = scoreCalc(myCard) + myScore;
    return updatedScore;
}

function scoreCalc(myCard) {
    let value;
    count = 0;
    let cardsSplit = myCard.split(" ")
    value = cardsSplit[0];
    switch (value) {
        case "Two":
            count += 2;
            break;
        case "Three":
            count += 3;
            break;
        case "Four":
            count += 4;
            break;
        case "Five":
            count += 5;
            break;
        case "Six":
            count += 6;
            break;
        case "Seven":
            count += 7;
            break;
        case "Eight":
            count += 8;
            break;
        case "Nine":
            count += 9;
            break;
        case "Ace":
            aceCase(count);
        default:
            count += 10;
            break;
    }
    return count;

}

function cardDeal(myDeck) {
    var rand = myDeck[Math.floor(Math.random() * myDeck.length)];
    myDeck.splice(rand, 1);
    return rand;
}
