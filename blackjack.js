//
// Blackjack
//

var mainContainer = document.createElement("div");
var theCard = document.createElement('div');
var theFront = document.createElement('div');
var theBack = document.createElement('div');

var playerCards;
var dealerCards;
var deck;
var playerScore;
var dealerScore;
var aceExistencePlayer;
var aceExistenceDealer;
var playerCardString;
var dealerCardString;
var playerStack;
var dealerStack;

    let cardAreaPlayer=document.getElementById('card-area-player');
    cardAreaPlayer.style.display = 'none';

    cardAreaDealer=document.getElementById('card-area-dealer');
    cardAreaDealer.style.display='none';
    let newG = document.getElementById("new");
    newG.style.display = 'none';

    let start = document.getElementById("start");

    let stop = document.getElementById("stop");
    stop.style.display = 'none';

    let hit = document.getElementById("hit");
    hit.style.display = 'none';
    resultArea = document.getElementById('result-area');

newG.addEventListener('click', function () {
    theCard.removeAttribute('style');
    mainContainer.removeAttribute('style');
    theFront.removeAttribute('style');
    theBack.removeAttribute('style');
    while(cardAreaPlayer.firstChild){
        cardAreaPlayer.removeChild(cardAreaPlayer.firstChild);
    }
    while(cardAreaDealer.firstChild){
        cardAreaDealer.removeChild(cardAreaDealer.firstChild)
    }
    startGame();
});

start.addEventListener('click', function () {
    startGame();
});
function startGame() {
    playerStack=0;
    dealerStack=0;
    aceExistencePlayer = false;
    aceExistenceDealer = false;
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
    cardAreaPlayer.innerHTML='Player has:';
    cardAreaPlayer.style.display='flex';
    cardAreaDealer.innerHTML='Dealer has:';
    cardAreaDealer.style.display='flex';
    deck = createDeck();
    playerCards.push(cardDeal(deck,playerCards));
    playerCards.push(cardDeal(deck,playerCards));
    dealerCards.push(cardDeal(deck,dealerCards));
    dealerCards.push(cardDeal(deck,dealerCards));

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
}
stop.addEventListener('click', function () {
    if(dealerCards.length>3)
        mainContainer.style.marginLeft='-335px';
    else
        mainContainer.style.marginLeft='-175px';

    theFront.style.left='115px';
    theBack.style.left='115px'
    theCard.style.transform='rotateY(180deg)';
    stop.style.display = 'none';
    hit.style.display = 'none';
    newG.style.display = 'inline';
    dealerPlays();
});

function dealerPlays() {
    while (dealerScore <= 21) {
        if(dealerCards.length==5)
        {
            resultArea.innerHTML = 'The dealer wins!';
            break;
        }
        if (dealerScore <= playerScore) {
            dealerCards.push(cardDeal(deck,dealerCards));
            dealerScore += dealerCards[dealerCards.length - 1].score;
            dealerCardString += dealerCards[dealerCards.length - 1].value +' of '+ dealerCards[dealerCards.length - 1].sign + '<br>';
            if(gameWinner(dealerScore)==true)
                resultArea.innerHTML='The dealer wins';
            else
                resultArea.innerHTML='The player wins';
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

function gameDecision(count,playerDeck) {
    if (count == 21) {
        return true;
    } else {
        return false;
    }
}

hit.addEventListener('click', function () {
    playerCards.push(cardDeal(deck,playerCards));
    playerCardString += playerCards[playerCards.length - 1].value + ' of ' +  playerCards[playerCards.length - 1].sign + '<br>';
    playerScore += playerCards[playerCards.length - 1].score;
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
    console.log(dealerCards);
}

function aceCase(count,value) {
    if ( count+value>21)
        {
            count-=10;
            if(aceExistencePlayer==true)    
                aceExistencePlayer = false;
            else
                if(aceExistenceDealer==true)
                    aceExistenceDealer = true;
            console.log(count);
        }
        return count;

}

function cardDeal(myDeck,playerDeck) {
    var rand = Math.floor(Math.random() * myDeck.length);
    let card = myDeck[rand];
    if(card.value=='Ace' )
    {
        if(playerDeck==playerCards)
        {
            aceExistencePlayer=true;
            playerScore=aceCase(playerScore,card.score);
        }
        else{
            aceExistenceDealer=true;
            dealerScore=aceCase(dealerScore,card.score);
        }
    }
    else
    {
        if(aceExistencePlayer==true)
        {
                playerScore=aceCase(playerScore,card.score);}
        else{
            if(aceExistenceDealer==true)
                dealerScore=aceCase(dealerScore,card.score);
        }
            
    }
    generateImages(card,playerDeck);
    myDeck.splice(rand, 1);
    return card;
}

function generateImages(card, playerDeck) {
    if (dealerCards.length != 1) {
        var div = document.createElement("div");
        div.style.background = 'url("image/52_playing_cards.png")';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.width = '177px';
        div.style.height = '299px';
        div.style.padding = '3px 35px 22px 9px';
        div.style.backgroundPositionX = card.imageX + 'px';
        div.style.backgroundPositionY = card.imageY + 'px';
        div.style.display = 'flex';
        div.style.position = 'flex';
        div.style.animation = '1s ease-out 0s 1 rightToLeft';
        if (playerDeck == playerCards) {
            if (playerStack == 1)
                div.style.marginLeft = -190 + 'px';
            if (playerStack > 1) {
                div.style.marginLeft = (-195) + 'px';
            }
            cardAreaPlayer.appendChild(div)
            playerStack++;
        } else {
            if (dealerStack > 1) {
                div.style.marginLeft = (-195) + 'px';
            }
            cardAreaDealer.appendChild(div);
            dealerStack++;
        }
    }
    else
        dealerSecondCard(card);
}
function dealerSecondCard(card)
{
    mainContainer.style.position = 'relative';
    mainContainer.style.width = '177px';
    mainContainer.style.height = '299px';


    theCard.style.position = 'absolute';
    theCard.style.width='100%';
    theCard.style.height = '100%';
    theCard.style.transformStyle='preserve-3d';
    theCard.style.transition=' all 0.5s ease';
    theCard.style.animation='1s ease-out 0s 1 rightToLeft';

    theFront.style.position = 'absolute';
    theFront.style.width='100%';
    theFront.style.height='100%';
    theFront.style.backfaceVisibility = 'hidden';
    theFront.style.background = 'url("image/card_back.png")';
    theFront.style.padding = '3px 35px 25px 9px';
    theFront.style.backgroundPosition = '0px 0px';
    theFront.style.marginLeft ='-190px';
    theFront.style.top='0px';
    theFront.style.borderRadius = "8%";
    theFront.style.display='flex';
    // theFront.style.left='-334px';


    theBack.style.position ='absolute';
    theBack.style.width='100%';
    theBack.style.height='100%';
    theBack.style.backfaceVisibility = 'hidden';
    theBack.style.background='url("image/52_playing_cards.png")';
    theBack.style.padding='3px 35px 22px 9px';
    theBack.style.backgroundPosition = '-17px -17px';
    theBack.style.display='flex';
    theBack.style.transform='rotateY(180deg)';
    theBack.style.marginLeft='-190px';
    theBack.style.backgroundPositionX = card.imageX + 'px';
    theBack.style.backgroundPositionY = card.imageY + 'px';
    // theBack.style.left='-334px';

    cardAreaDealer.appendChild(mainContainer);
    mainContainer.appendChild(theCard);
    theCard.appendChild(theFront);
    theCard.appendChild(theBack);
    dealerStack++;
}
