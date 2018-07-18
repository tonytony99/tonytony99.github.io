
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

var numSims = 500;

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
function indicesToValues(indices){
	var values = indices.slice();
	var i;
	for(i=0; i<indices.length; i++){
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



// return the values but 1 is swapped for 14
// the list is re-sorted
function acesHigh(values) {
	var result = values.slice();
	var i;
	for(i=0; i<result.length; i++){
		if (result[i] == 1) { result[i] = 14;}
	}
	result.sort(function (a, b) {  return a - b;});
	return result;	
}

// e.g. [1,10,11,12,13], [0,9,10,11,12] returns true
function royalFlush5(values, indices){
	if (straightFlush5(values, indices)==14){
		return true;
	}	
	return false;
}

// e.g. [2,3,4,5,6], [1,2,3,4,5] returns 6
function straightFlush5(values, indices){
	var straightTo = straight5(values);
	if (straightTo && flush5(values, indices)){
		return straightTo;	
	}
	return false;
}

// e.g. [2,7,7,7,7] returns [7,2]
function fourOfAKind5(values){

	if (values[4] == values[3]
	 && values[4] == values[2]
	 && values[4] == values[1]){
		return [values[4], values[0]];	 
	}
	if (values[0] == values[1]
	 && values[0] == values[2]
	 && values[0] == values[3]){
		return [values[0], values[4]];	 
	}
	return false;
}

// e.g. [6,6,7,7,7] returns [7,6]
// e.g. [1,1,1,7,7] returns [14,7]
function fullHouse5(values){
	values = acesHigh(values);

	if (values[0] == values[1]
	 && values[2] == values[3]
	 && values[2] == values[4]){
		return [values[2],values[0]];
	}
	if (values[0] == values[1]
	 && values[0] == values[2]
	 && values[3] == values[4]){
		return [values[0],values[3]];	 
	 }
	 return false;
}

// e.g. [1,3,4,5,6,9], [0,2,3,4,5,8] returns [14,9,6,5,4,3]
function flush5(values, indices){
	var suit = Math.floor(indices[0] / 13.0);

	var i;
	for(i=1; i<indices.length; i++){
		if (Math.floor(indices[i] / 13.0) != suit) {
			return false;		
		}
	}
	var result = acesHigh(values);
	// sort descending
	result.sort(function (a, b) {  return b - a;  });	
	return result;
}

// e.g. [2,3,4,5,6,7] returns 7
// e.g. [1,10,11,12,13] returns 14
function straight5(values){
	maxValue = values[4];
	if (values[3] == maxValue - 1
	 && values[2] == maxValue - 2
	 && values[1] == maxValue - 3
	 && values[0] == maxValue - 4){
		return maxValue;	 
	}
	
	// Straight to ace
	if (values[4] == 13
	 && values[3] == 12
	 && values[2] == 11
	 && values[1] == 10
	 && values[0] == 1) {
		return 14; 
	}
	
	return false;
}

// e.g. [1,1,1,5,7] returns [14,7,5]
function threeOfAKind5(values){
	values = acesHigh(values);
	
	if (values[4] == values[3]
	 && values[4] == values[2]){
		return [values[4],values[1],values[0]];	 
	}
	if (values[3] == values[2]
	 && values[3] == values[1]){
		return [values[3],values[4],values[0]];	 
	}
	if (values[2] == values[1]
	 && values[2] == values[0]){
		return [values[2],values[4],values[3]];	 
	}
	return false;
}

// e.g. [1,1,3,3,7] returns [14,3,7]
// e.g. [4,5,5,8,8] returns [8,5,4]
function twoPair5(values){
	values = acesHigh(values);

	if (values[4] == values[3]
	 && values[2] == values[1]){
		return [values[4],values[2],values[0]];	
	}
	if (values[4] == values[3]
	 && values[1] == values[0]){
		return [values[4],values[1], values[2]];	
	}
	if (values[3] == values[2]
	 && values[1] == values[0]){
		return [values[3],values[1], values[4]];	
	}
	return false;
}

// e.g. [1,1,3,5,7] returns [14,7,3,5]
// e.g. [4,5,9,9,13] returns [9,13,5,4]
function pair5(values){
    values = acesHigh(values);
    if (values[4]==values[3]) {return [values[4],values[2],values[1],values[0]];}
	if (values[3]==values[2]) {return [values[3],values[4],values[1],values[0]];}
	if (values[2]==values[1]) {return [values[2],values[4],values[3],values[0]];} 
	if (values[1]==values[0]) {return [values[1],values[4],values[3],values[2]];}
	return false;
}

// Given 5 cards, what is their highest achievement?
// [0] royal flush
// [1,8] straight flush to 8
// ... 
// [7,9,2] two pair of 9s and 2s
function rank5(values, indices) {
	
	if (royalFlush5(values, indices)){ 
		return [9]; 
	}
	
	sF = 	straightFlush5(values, indices);
	if (sF){ 
		return [8,sF]; 
	}
	
	fOK = fourOfAKind5(values);
	if (fOK){ 
		fOK.unshift(7);
		return fOK; 
	}
	
	fH = fullHouse5(values);
	if (fH){ 
		fH.unshift(6);
		return fH; 
	}
	
	f = flush5(values, indices);
	if (f){ 
		f.unshift(5);
		return f; 
	}
	
	s = straight5(values);
	if (s){ 
		return [4,s]; 
	}
	
	tOK = threeOfAKind5(values);
	if (tOK){ 
		tOK.unshift(3);
		return tOK; 
	}
	
	tP = twoPair5(values);
	if (tP){ 
		tP.unshift(2);
		return tP; 
	}
	
	p = pair5(values);
	if (p){ 
		p.unshift(1);
		return p; 
	}
	
	var highCards = acesHigh(values);
	// sort descending
	highCards.sort(function (a, b) {  return b - a;});
	highCards.unshift(0);
	return highCards;
	
}

// Return the best 5 card hand that can be made with these 7 cards
function best5From7(values, indices) {
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
		
		hand.sort(function (a, b) {  return a % 13 - b % 13;  });
		values = indicesToValues(hand);
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
		var values7 = indicesToValues(hand7);
		var suits7 = indicesToSuits(hand7);
		var best5 = best5From7(values7, hand7);
		var values5 = indicesToValues(best5);
		var suits5 = indicesToSuits(best5);	
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
			// console.log(hand7);
			var values7 = indicesToValues(hand7);
			var suits7 = indicesToSuits(hand7);
			var best5 = best5From7(values7, hand7);
			var values5 = indicesToValues(best5);
			var suits5 = indicesToSuits(best5);	
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


