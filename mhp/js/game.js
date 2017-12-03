// 0 closed goat
// 1 closed car
// 2 open goat
// 3 open car
var doorsArray = [];

// which door was most recently selected
var selected = -1;

// 1 if player has stuck, 0 otherwise
var hasStuck = 0;

// wins losses, used to populate results table
var switchWins = 0;
var switchLosses = 0;
var switchSuccessRate = 0;
var stickWins = 0;
var stickLosses = 0;
var stickSuccessRate = 0;

// wait for ms milliseconds
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// disable simulation and new game buttons
function disableChoices() {
	document.getElementById("simulateSwitch").disabled = true;
	document.getElementById("simulateStick").disabled = true;
	document.getElementById("begin").disabled = true;
}

// enable simulation and new game buttons
function enableChoices() {
	document.getElementById("simulateSwitch").disabled = false;
	document.getElementById("simulateStick").disabled = false;
	document.getElementById("begin").disabled = false;
}
	
// perform 100 new games and stick in all of them
async function simulateStick() {
	disableChoices();
	for (z = 0; z < 100; z++) {
		game(3);
		doorClicked(Math.floor(Math.random() * doorsArray.length));
		stick();
		await sleep(20);
	}
	enableChoices();
}

// perform 100 new games and switch in all of them
async function simulateSwitch() {
	disableChoices();
	for (z = 0; z < 100; z++) {
		game(3);
		doorClicked(Math.floor(Math.random() * doorsArray.length));
		for (s = 0; s < 3; s++) {
			if (doorsArray[s] < 2 && s != selected) {
				doorClicked(s);
				break;
			}
		}
		await sleep(20);
	}
	enableChoices();
}

// update the table of results with statistics about game results
function updateTable() {
	document.getElementById("switchWin").innerHTML = switchWins;
	document.getElementById("switchLose").innerHTML = switchLosses;
	document.getElementById("switchSuccessRate").innerHTML = switchSuccessRate;
	document.getElementById("stickWin").innerHTML = stickWins;
	document.getElementById("stickLose").innerHTML = stickLosses;
	document.getElementById("stickSuccessRate").innerHTML = stickSuccessRate;
}

// return 1 if the player has won, 0 otherwise
function getWin() {
	var result = (doorsArray[selected] == 3) ? 1 : 0;
	return (result);
}

// do all of the actions required at the end of the game
function handleWin() {
	if (getWin()) {
		if (hasStuck == 1) {
			stickWins += 1;
		} else {
			switchWins += 1;
		}
		document.getElementById('instructions').innerHTML = 'You win!';
	} else {
		if (hasStuck == 1) {
			stickLosses += 1;
		} else {
			switchLosses += 1;
		}
		document.getElementById('instructions').innerHTML = 'Bad luck!';
	}
	switchSuccessRate = switchWins / (switchWins + switchLosses);
	stickSuccessRate = stickWins / (stickWins + stickLosses);


	switchSuccessRate = switchSuccessRate.toPrecision(3);
	stickSuccessRate = stickSuccessRate.toPrecision(3);

	if (isNaN(switchSuccessRate)) {
		switchSuccessRate = '-';
	}
	if (isNaN(stickSuccessRate)) {
		stickSuccessRate = '-';
	}

	updateTable();
}

// return the number of doors opened so far this game
function numDoorsUnopened() {
	n = 0
	for (i = 0; i < doorsArray.length; i++) {
		if (doorsArray[i] < 2) {
			n++;
		}
	}
	return (n);
}

// open every closed door
function openAllDoors() {
	for (j = 0; j < doorsArray.length; j++) {
		open(j);
	}
}

// open every closed door and see if the player won
function stick() {
	hasStuck = 1;
	openAllDoors();
	handleWin();
}

// if the door is closed, then open it
function open(doorNumber) {
	if (doorsArray[doorNumber] < 2) {
		doorsArray[doorNumber] = doorsArray[doorNumber] + 2;
		drawDoors();
	}
}

// choose a door that is not selected and does not have a
// prize behind it, and open it
function openOtherDoor(doorNumber) {
	openIndex = Math.floor(Math.random() * doorsArray.length);
	while (doorsArray[openIndex] != 0 || openIndex == doorNumber) {
		openIndex = Math.floor(Math.random() * doorsArray.length);
	}
	open(openIndex);
}

// handle the door being clicked
function doorClicked(doorNumber) {
	if (doorsArray[doorNumber] < 2) {
		if (doorNumber == selected) {
			hasStuck = 1;
		}
		selected = doorNumber;
		document.getElementById('instructions').innerHTML = 'Click a different door to switch, or the same door to stick.';
		if (numDoorsUnopened() >= 3) {
			openOtherDoor(doorNumber);
		} else {
			openAllDoors();
			handleWin();
		}
	}
}

// put the doors on screen, doors are drawn differently
// depending on whether they're closed, open with loss,
// or open with prize
function drawDoors() {
	document.getElementById("doors").innerHTML = "";
	for (i = 0; i < doorsArray.length; i++) {
		var doors = document.getElementById('doors');
		var buttonString = "";
		buttonString += "<input type='image' ";
		if (doorsArray[i] < 2) {
			buttonString += "src='img/closedDoor.png' ";
		}
		if (doorsArray[i] == 2) {
			buttonString += "src='img/goat.png' ";
		}
		if (doorsArray[i] == 3) {
			buttonString += "src='img/car.png' ";
		}
		if (i == selected) {
			buttonString += "class='selected' ";
		} else {
			buttonString += "class='unselected' ";
		}
		buttonString += "onclick = 'doorClicked(" + i + ")'; ";
		buttonString += "value = '" + (i + 1) + "' /> ";
		doors.innerHTML += buttonString;
	}
}

// begin a new game
function game(numDoors) {
	hasStuck = 0;
	selected = -1;
	doorsArray = [];
	for (var i = 1; i <= numDoors; i++) {
		doorsArray.push(0);
	}
	carIndex = Math.floor(Math.random() * numDoors);
	doorsArray[carIndex] = 1;
	drawDoors();
	document.getElementById('instructions').innerHTML = 'Choose a door to begin.';
	updateTable();
}