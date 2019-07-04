//
// Blackjack
//

var playerCards;
var dealerCards;
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
    var x=document.getElementsByTagName('div');
    x.innerHTML='';
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
        playerCardString += playerCards[i].value + ' of ' + playerCards[i].sign + "<br>";
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += dealerCards[i].value + ' of ' + dealerCards[i].sign + "<br>";
    }
    for (let i = 0; i < playerCards.length; i++) {
        playerScore += playerCards[i].score;
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerScore += dealerCards[i].score;
    }
    if(playerScore==21)
    {
        resultArea.innerHTML='The player wins!';
    }
    showGameStats();
}

function showGameStats()
{
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
        if(dealerCards.length==5)
        {
            resultArea.innerHTML = 'The dealer wins!'
        }
        if (dealerScore <= playerScore) {
            textArea.innerHTML = ' ';
            dealerCards.push(cardDeal(deck));
            dealerScore += dealerCards[dealerCards.length - 1].score;
            console.log(dealerScore);
            dealerCardString += dealerCards[dealerCards.length - 1].value +' of '+ dealerCards[dealerCards.length - 1].sign + '<br>';
            if(gameWinner(dealerScore)==true)
                resultArea.innerHTML='The dealer wins';
            else
                resultArea.innerHTML='The player wins';
            showGameStats();
        } else {
            resultArea.innerHTML = 'The dealer wins!'
            break;
        }
    }
    
    gameWinner(dealerScore);
}

function createDeck() {
    var deck = [];
    var signs = ["Spades","Hearts",  "Diamonds", "Clubs"];
    var values = ["Ace", "Two", "Three", "Four",  "Five","Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen","King"];
    let cardScore=0;
    let imageX=-17;
    let imageY=-17;
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < signs.length; j++) {
            if(i==0)
            {
                cardScore=11;
                aceExistence=true;
            }
            else
            {
                if(i>=9)
                    cardScore=10;
                else
                {
                    cardScore=i+1;
                }
            }
            deck.push({
                value : values[i],
                sign : signs[j],
                score: cardScore,
                imageX: imageX + i*(-229),
                imageY: imageY + j*(-334)
            })
        }
    }
    return deck;
}


function aceCase(count) {
    if ( count>21)
        count-=10
    aceExistence = false;
    return count;

}


function gameDecision(count) {
    if(aceExistence==true)
    {
        count = aceCase;
    }
    if (count == 21) {
        return true;
    } else {
        return false;
    }
}

hit.addEventListener('click', function () {
    textArea.innerHTML = ' ';
    playerCards.push(cardDeal(deck));
    playerCardString += playerCards[playerCards.length - 1].value + ' of ' +  playerCards[playerCards.length - 1].sign + '<br>';
    playerScore += playerCards[playerCards.length - 1].score;
    showGameStats();
    if(playerScore>=21)
        if(gameWinner(playerScore)==true)
                {
                    resultArea.innerHTML='The player wins!';
                }
            else
                { 
                    resultArea.innerHTML='The dealer wins!';
                }
});

function gameWinner(score) {
    if (score >= 21) {
        if (gameDecision(score) == true) {
            newGame();
            return true;
        } else {
            newGame();
            return false;
        }
    }
}

function newGame() {
    stop.style.display = 'none';
    hit.style.display = 'none';
    newG.style.display = 'inline';

}

function cardDeal(myDeck) {
    var rand = Math.floor(Math.random() * myDeck.length);
    let card = myDeck[rand];
    var div = document.createElement("div");
    div.style.background='url("image/52_playing_cards.png")';
    div.style.backgroundRepeat='no-repeat';
    div.style.width='175px';
    div.style.height='299px';
    div.style.padding='2px 29px 21px 9px';
    console.log(myDeck[rand].imageX,myDeck[rand].imageY)
    div.style.backgroundPositionX=myDeck[rand].imageX + 'px';
    div.style.backgroundPositionY=myDeck[rand].imageY + 'px';
    console.log(div.style.backgroundPositionX)
    document.body.appendChild(div);
    myDeck.splice(rand, 1);
    return card;
}
