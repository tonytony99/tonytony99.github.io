
const cardNames = [-1,"A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
const emojis = ["♣️", "♦️", "♥️", "♠️"];
const rankStrings = ["High Card",
							"Pair",
							"Two Pair",
							"Three of a Kind",
							"Straight",
							"Flush",
							"Full House",
							"Four of a Kind",
							"Straight Flush",
							"Royal Flush"];
							
var nextCard = -1;

var numSims = 200;

// control the number of simulations
var slider = document.getElementById("simNumberInput");
var output = document.getElementById("simCount");
slider.oninput = function() {
    numSims = slider.value;
    output.innerHTML = slider.value;
    updateReport();
} 

function updateBars() {
	for (i=0; i<rp.length; i++){
		document.getElementById("bar"+i).style.height = (rp[i]*220) + "px"; 
	}
}

function showOptions(){
	document.getElementById("cardInputArea").setAttribute("class","cardInputAreaVisible");
}

function hideOptions(){
	document.getElementById("cardInputArea").setAttribute("class","cardInputAreaHidden");
}
							
function indexToValue(index){
	return index % 13 + 1;
}

function indexToSuit(index){
	return Math.floor(index / 13.0)
}

// From an array of indices, return the values of those cards
function indicesToValues5(indices){
	var values = [-1,-1,-1,-1,-1];
	var i;
	for(i=0; i<5; i++){
		values[i] = indexToValue(indices[i]);
	}
	return values;
}


// From an array of indices, return the suits those cards
function indicesToSuits(indices){
	var suits = indices.slice();
	var i;
	for(i=0; i<indices.length; i++){
		suits[i] = indexToSuit(indices[i]);
	}
	return suits;
}

function mine(i) {
	// if there's already a card
	if (myHand[i] > -1) {	
		showOptions();
		// return that card to the pool
		document.getElementById("option"+(myHand[i]+1)).disabled = false;
		// clear the card
		myHand[i] = -1;	
		myValues[i] = -1;
		mySuits[i] = -1;		
	}
	// if there's no card
	else {
		// make the available cards visible
		showOptions();
	}
	// make this the active card (0-1)
	nextCard = i;
	
	drawCards();
	updateReport();
}

function table(i) {
	// if there's already a card
	if (tableCards[i] > -1) {	
		showOptions();
		// return that card to the pool
		document.getElementById("option"+(tableCards[i]+1)).disabled = false;
		// clear the card
		tableCards[i] = -1;
		tableValues[i] = -1;
		tableSuits[i] = -1;		
	}
	// if there's no card
	else {
		// make the available cards visible
		showOptions();
	}
	// make this the active card (0-1)
	nextCard = 2 + i;
	
	drawCards();
	updateReport();
}

// find the next empty slot for a new card
function advanceNextCard() {
	var startPoint = nextCard;
	nextCard ++;
	while (nextCard != startPoint) {
		if (nextCard < 2 && myHand[nextCard]==-1) {
			break		
		}
		if (nextCard >= 2 && tableCards[nextCard-2]==-1) {
			break		
		}
		nextCard ++;	
		if(nextCard>6){
			nextCard = 0;		
		}	
	}
	// if we got back to the start, there are no slots
	if(nextCard == startPoint){
		nextCard = -1;	
		hideOptions();
	}
	
}

// insert the card i into the next slot
function insertCard(i) {
	if (nextCard == -1) {
		return;	
	}

	// if next active card is a mine card
	if (nextCard == 0 || nextCard == 1){
		// set this card to be in mine
		myHand[nextCard] = i;
		myValues[nextCard] = indexToValue(i);
		mySuits[nextCard] = indexToSuit(i);
	}	
	
	// if next active card is a table card
	if (nextCard >= 2){
		// set this card to be in mine
		tableCards[nextCard-2] = i;
		tableValues[nextCard-2] = indexToValue(i);
		tableSuits[nextCard-2] = indexToSuit(i);	
	}	
	
	// disable this card
	document.getElementById("option"+(i+1)).disabled=true;
	
	advanceNextCard();
	drawCards();
	
	updateReport();
}
							
function drawCards() {
	var i;
	var cardString;
	for (i=0;i<myValues.length;i++){
		if (nextCard == i) {
			document.getElementById("mine"+i).setAttribute("class","waitingCard");
		} else {
			if (mySuits[i]==1 || mySuits[i] ==2) {
				document.getElementById("mine"+i).setAttribute("class","redCard");
			} else {
				document.getElementById("mine"+i).setAttribute("class","card");
			}
		}
		if(myValues[i] >= 0) {
			cardString = cardNames[myValues[i]] + emojis[mySuits[i]];
			document.getElementById("mine"+i).innerHTML = cardString;
		} else {
			document.getElementById("mine"+i).innerHTML = "&nbsp;";
		}
	}
	
	for (i=0;i<tableValues.length;i++){
		if (nextCard == i+2 && nextCard !=-1) {
			document.getElementById("table"+i).setAttribute("class","waitingCard");
		} else {
			if (tableSuits[i]==1 || tableSuits[i] ==2) {
				document.getElementById("table"+i).setAttribute("class","redCard");
			} else {
				document.getElementById("table"+i).setAttribute("class","card");
			}
		}
		if(tableValues[i] >= 0) {
			cardString = cardNames[tableValues[i]] + emojis[tableSuits[i]];
			document.getElementById("table"+i).innerHTML = cardString;
		} else {
			document.getElementById("table"+i).innerHTML = "&nbsp;";
		}
	}
}

function drawOptions(){
	var i;
	var cardString;
	
	for (i=0;i<4;i++){
		for (j=1;j<14;j++){
			var row = document.getElementById("inputRow" + i);
			var b = document.createElement("button");
			b.setAttribute("id","option"+(i*13+j));
			b.setAttribute("class","smallCard");
			if (indexToSuit(i*13+j-1) == 1 || indexToSuit(i*13+j-1) == 2 ) {
				b.setAttribute("class","smallRedCard");	
			}
			b.setAttribute("onclick","insertCard("+(i*13+j-1)+")");
			b.innerHTML = cardNames[j] + emojis[i];
			row.appendChild(b);	
		}	
	}
}

drawOptions();


							
var rankProbabilities = [0,0,0,0,0,0,0,0,0,0];
						
function writeCards(values, indices, suits){
	var i;
	for (i=0;i<values.length;i++){
		document.write(cardNames[values[i]]);
		document.write(emojis[suits[i]]);
	}
}
						
function drawCard(cardsSoFar) {
	var unique = false;
	var newCard = Math.floor(Math.random()*52);
	var j;	
	for (j=1; j<cardsSoFar.length; j++){
		if (cardsSoFar[j] == newCard) {
			newCard = drawCard(cardsSoFar);
		}	
	}
	for (j=1; j<cardsSoFar.length; j++){
		if (cardsSoFar[j] == newCard) {
			newCard = drawCard(cardsSoFar);
		}	
	}
	return newCard;
}						

// Return 0 if first is best, else 1
function bestOf2Hands(first, second){
	var i;
	for (i=0;i<first.length;i++){
		if (first[i]>second[i]) {return 0;}	
		if (second[i]>first[i]) {return 1;}
	}
	// a tie, either could be returned so return first
	return 0;
}




function rank5(values, indices) {

	// -1 : don't know
	// 0 :  no
	// >0 : yes
	var straightTo = -1;	
	// look for a straight
	var maxValue = values[4];
	if (values[3] == maxValue - 1
	 && values[2] == maxValue - 2
	 && values[1] == maxValue - 3
	 && values[0] == maxValue - 4){
		straightTo = maxValue;	 
	}
	// Straight to ace
	if (values[4] == 13
	 && values[3] == 12
	 && values[2] == 11
	 && values[1] == 10
	 && values[0] == 1) {
		straightTo = 14;
	}
	// No straight
	if (straightTo < 0) {
		straightTo = 0;	
	}

	// -1 : don't know
	// 0 : no
	// 1 : yes
	var flush = -1;
	var suit = Math.floor(indices[0] / 13.0);
	var i;
	for(i=1; i<indices.length; i++){
		if (Math.floor(indices[i] / 13.0) != suit) {
			flush = 0;
			break;		
		}
	}
	// if we haven't disproved a flush, then we have a flush
	if (flush < 0) {
		flush = 1;	
	}
	
	if (flush==1) {
		// royal flush	
		if (straightTo == 14){
			return [9]; 
		}
		// straight flush
		if (straightTo > 0) {
			return [8,straightTo]; 	
		}
	}
	
	// four of a kind
	if (values[4] == values[3]
	 && values[4] == values[2]
	 && values[4] == values[1]){
		return [7,values[4], values[0]];	 
	}
	if (values[0] == values[1]
	 && values[0] == values[2]
	 && values[0] == values[3]){
		return [7,values[0], values[4]];	 
	}
	
	// full house
	if (values[0] == values[1]
	 && values[2] == values[3]
	 && values[2] == values[4]){
		return [6,values[2],values[0]];
	}
	if (values[0] == values[1]
	 && values[0] == values[2]
	 && values[3] == values[4]){
		return [6,values[0],values[3]];	 
	 }

	// flush
	if (flush == 1) {
		return [5];	
	}

	// straight
	if (straightTo > 0){
		return [4,straightTo];	
	}

	// aces high
	var changedAny = false;
	for(i=0; i<values.length; i++){
		if (values[i] == 1) { 
			values[i] = 14;
			changedAny = true;
		} else {
			// cannot be more aces
			break;		
		}
	}
	// if some 1s have become 14s the values must be re-sorted
	if (changedAny) {
		values.sort(function (a, b) {  return a - b;});
	}
	
	// three of a kind
	if (values[4] == values[3]
	 && values[4] == values[2]){
		return [3,values[4],values[1],values[0]];	 
	}
	if (values[3] == values[2]
	 && values[3] == values[1]){
		return [3,values[3],values[4],values[0]];	 
	}
	if (values[2] == values[1]
	 && values[2] == values[0]){
		return [3,values[2],values[4],values[3]];	 
	}
	
	// two pair
	if (values[4] == values[3]
	 && values[2] == values[1]){
		return [2,values[4],values[2],values[0]];	
	}
	if (values[4] == values[3]
	 && values[1] == values[0]){
		return [2,values[4],values[1], values[2]];	
	}
	if (values[3] == values[2]
	 && values[1] == values[0]){
		return [2,values[3],values[1], values[4]];	
	}
	
	// pair
	if (values[4]==values[3]) {return [1,values[4],values[2],values[1],values[0]];}
	if (values[3]==values[2]) {return [1,values[3],values[4],values[1],values[0]];}
	if (values[2]==values[1]) {return [1,values[2],values[4],values[3],values[0]];} 
	if (values[1]==values[0]) {return [1,values[1],values[4],values[3],values[2]];}
	
	// high card(s)
	// sort descending
	values.reverse();
	values.unshift(0);
	return values;	
}


// Return the best 5 card hand that can be made with these 7 cards
function best5From7(indices) {
	// sort cards by value order
	indices.sort(function (a, b) {  return a % 13 - b % 13;  });
	var i;
	var j;
	var theseIndices;
	var hand = [0,0,0,0,0];
	var values;
	var result;
	var possibleIndices =  [[0,1,2,3,4],
									[0,1,2,3,5],
									[0,1,2,3,6],
									[0,1,2,4,5],
									[0,1,2,4,6],
									[0,1,2,5,6],
									[0,1,3,4,5],
									[0,1,3,4,6],
									[0,1,3,5,6],
									[0,1,4,5,6],
									[0,2,3,4,5],
									[0,2,3,4,6],
									[0,2,3,5,6],
									[0,2,4,5,6],
									[0,3,4,5,6],
									[1,2,3,4,5],
									[1,2,3,4,6],
									[1,2,3,5,6],
									[1,2,4,5,6],
									[1,3,4,5,6],
									[2,3,4,5,6]];
	
	
	var bestScore = [-1];
	var best5 = [0,0,0,0,0];	
	for (i=0;i<possibleIndices.length;i++){
		theseIndices = possibleIndices[i];
		for (j=0;j<theseIndices.length;j++){
			hand[j] = indices[theseIndices[j]];
		}		
		values = indicesToValues5(hand);
		result = rank5(values, hand);
		
		if (bestOf2Hands(result, bestScore) == 0){
			bestScore = result.slice();
			best5 = hand.slice();	
		}
	}
	
	return best5;
} 
//var indices = [13, 22, 23, 24, 25, 26, 27, 29];
//var hand = indicesToArray(indices);			

// var hand = [0,9,10,11,12];   // royal flush
// var hand = [13,22,23,25,24]; // royal flush
// var hand = [26,36,37,38,35]; // royal flush

// var hand = [1,2,3,4,5];       // straight flush 6
// var hand = [25, 21,22,23,24]; // straight flush 13

// var hand = [1,8,8,8,8];      // FOK 9,2
// var hand = [25,25,25,25,48]; // FOK 13,10

// var hand = [34,34,7,7,7];    // FH [8,9]
// var hand = [0,0,0,7,7];      // FH [14,8]

// var hand = [0,2,3,4,5];      // flush [14,6,5,4,3]
// var hand = [49,50,51,44,45]; // flush [13,12,11,7,6]

// var hand =  [2,3,4,5,6,20];  // straight 8 
// var hand =  [0,9,10,11,25];  // straight 14

// var hand = [0,13,26,5,7];    // TOK [14,8,6]
// var hand = [14,20,33,5,46];  // TOK [8,6,2]

// var hand = [13,39,3,29,7];   // TP [14,4,8]
// var hand = [14,25,38,18,31]; // TP [13,6,2]

// var hand = [13,39,3,1,7];    // P [14,8,4,2]
// var hand = [0,13,3,5,7]      // P [14,8,6,4]
// var hand = [14,45,29,19,13]  // P [7,14,4,2]

// var hand = [23,12,21,13,9]; // HC [14,13,11,10,9]

// hand.sort(function (a, b) {  return a % 13 - b % 13;  });
// var values = indicesToValues(hand);
// var suits = indicesToSuits(hand);

var myHand = [-1,-1];
var myValues = [-1,-1];
var mySuits = [-1,-1];

var tableCards = [-1,-1,-1,-1,-1];
var tableValues = [-1,-1,-1,-1,-1];
var tableSuits = [-1,-1,-1,-1,-1];

drawCards();

function numMissing(list){
	var i;	
	var nm = 0;
	for (i=0;i<list.length;i++){
		if (list[i]==-1)	{
			nm ++;		
		}
	}
	return nm;
}


function getProbabilityRanks(){
	var i, j, k;
	var nm = numMissing(tableCards);
	
	rankProbabilities = [0,0,0,0,0,0,0,0,0,0];	
	
	// all cards dealt, what's the result
	if (nm == 0){
		var hand7 = myHand.concat(tableCards);
		var best5 = best5From7(hand7);
		var values5 = indicesToValues5(best5);	
		var bestScore = rank5(values5, best5);
		rankProbabilities = [0,0,0,0,0,0,0,0,0,0];
		rankProbabilities[bestScore[0]] = 1.0;
	}
	

	// cards left to deal, simulate the result
	if (nm >0){
		var cardsSoFar = myHand.concat(tableCards);
		for (i=0;i<numSims;i++){
			var hand7 = cardsSoFar.slice();
			for (j=0;j<7;j++) {
				if (hand7[j]==-1) {
					hand7[j] = 	drawCard(hand7);				
				}
			}
			var best5 = best5From7(hand7);
			var values5 = indicesToValues5(best5);
			var bestScore = rank5(values5, best5);
			rankProbabilities[bestScore[0]] ++;
		}
		for (k=0;k<rankProbabilities.length;k++){
			rankProbabilities[k] = rankProbabilities[k]/numSims;	
		}
	}

	
	return rankProbabilities;
}

var rp;


function updateReport(){
	if (myHand[0] > -1 && myHand[1] > -1) {
		rp  = getProbabilityRanks();
		updateBars();
	}
}


