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

$(document).ready(function () {
    let newG = $('#new');
    newG.css('display','none');

    let start = $("#start");

    let stop = $("#stop");
    stop.css('display','none');

    let hit = $("#hit");
    hit.css('display','none');
    textArea = $('#text-area');
    resultArea = $('#result-area');

    newG.click(function () {
        startGame();
    });

    start.click(function () {
        startGame();
    });

    function startGame() {
        playerCards = [];
        dealerCards = [];
        playerScore = 0;
        dealerScore = 0;
        playerCardString = 'Player has: <br>';
        dealerCardString = 'Dealer has: <BR>';
        resultArea.html('');
        start.css('display','none');
        stop.css('display','inline');
        hit.css('display', 'inline');
        newG.css('display','none') ;
        deck = createDeck();
        playerCards.push(cardDeal(deck));
        playerCards.push(cardDeal(deck));
        dealerCards.push(cardDeal(deck));
        dealerCards.push(cardDeal(deck));

        textArea.html('');
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
            resultArea.html('The player wins!');
            newGame();
        }
        showGameStats();
    }

    function showGameStats() {
        textArea.html(playerCardString +
            '(Score : ' + playerScore + ')' + '<br><br>' +
            dealerCardString + '(Score : ' + dealerScore + ')');
    }
    stop.click(function () {
        stop.css('display','none');
        hit.css('display','none');
        newG.css('display','inline');
        dealerPlays();
    });

    function dealerPlays() {
        while (dealerScore <= 21) {
            if (dealerCards.length == 5) {
                resultArea.html('The dealer wins!');
            }
            if (dealerScore <= playerScore) {
                textArea.html(' ');
                dealerCards.push(cardDeal(deck));
                dealerScore += dealerCards[dealerCards.length - 1].score;
                console.log(dealerScore);
                dealerCardString += dealerCards[dealerCards.length - 1].value + ' of ' + dealerCards[dealerCards.length - 1].sign + '<br>';
                if (gameWinner(dealerScore) == true)
                    resultArea.html('The dealer wins');
                else
                    resultArea.html('The player wins');
                showGameStats();
            } else {
                resultArea.html('The dealer wins!');
                break;
            }
        }
        gameWinner(dealerScore);
    }

    function createDeck() {
        var deck = [];
        var signs = ["Hearts", "Spades", "Diamonds", "Clubs"];
        var values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
        let cardScore = 0;
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < signs.length; j++) {
                if (i == 0) {
                    cardScore = 11;
                    aceExistence = true;
                } else {
                    if (i >= 9)
                        cardScore = 10;
                    else {
                        cardScore = i + 1;
                    }
                }
                deck.push({
                    value: values[i],
                    sign: signs[j],
                    score: cardScore
                })
            }
        }
        return deck;
    }


    function aceCase(count) {
        if (count > 21)
            count -= 10
        aceExistence = false;
        return count;

    }


    function gameDecision(count) {
        if (count == 21) {
            return true;
        } else {
            return false;
        }
    }

    hit.click(function () {
        textArea.html(' ');
        playerCards.push(cardDeal(deck));
        playerCardString += playerCards[playerCards.length - 1].value + ' of ' + playerCards[playerCards.length - 1].sign + '<br>';
        playerScore += playerCards[playerCards.length - 1].score;
        showGameStats();
        if (playerScore >= 21) {
            console.log(playerScore);
            if (gameWinner(playerScore) == 'true') {
                resultArea.html('The player wins!');
            } else {
                resultArea.html('The dealer wins!');
            }
        }
    });

    function gameWinner(score) {
        if (score >= 21) {
            if (gameDecision(score) == 'true') {
                newGame();
                return true;
            } else {
                newGame();
                return false;
            }
        }
    }

    function newGame() {
        stop.css('display' ,'none');
        hit.css('display','none');
        newG.css('display' ,'inline');
    }

    function cardDeal(myDeck) {
        var rand = Math.floor(Math.random() * myDeck.length);
        let card = myDeck[rand];
        myDeck.splice(rand, 1);
        return card;
    }
});
