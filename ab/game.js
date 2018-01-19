// Returns the number of times element occurs in array
function numOccurrences(array, element) {
	var num = 0;
	for (var i = 0; i < array.length; i++) {
		if (array[i] == element) num++;
	}
	return num;
}

// Compute a histogram of the array (0 <= element < array.length)
function hist(array) {
	var histogram = [];
	for (var i = 0; i < array.length; i++) {
		histogram.push(numOccurrences(array, i));
	}
	return histogram;
}

// Compute a string from a board to be used in a hash table
function hashValue(board) {
	var hashString = "S";
	var boardHist = hist(board)
	hashString = hashString.concat(boardHist.join());
	return hashString;
}

// Return an array of resulting board positions
function getMoves(board) {
	var newState = [];
	var moves = [];
	for (var i = 0; i < board.length; i++) {
		if (board[i] > 0) {
			for (var j = 1; j <= board[i]; j++) {
				newState = board.slice();
				newState[i] -= j;
				moves.push(newState.slice());
			}
		}
	}
	return moves;
}

// Insert a node into the tree, return the hashString of the
// inserted node
function insertNode(tree, board, team, parent) {
	var hashString = hashValue(board)
		// If the tree already has a version of this board
	if (tree[hashString]) {
		// If the parent doesn't already have a version of this board
		if (tree[parent].children.indexOf(hashString) == -1) {
			tree[parent].children.push(hashString)
		}
	}
	// Otherwise we must make a new node
	else {
		var state = {
			board: board,
			team: team,
			value: 0,
			children: []
		}
		tree[hashString] = state;
		tree[parent].children.push(hashString)
	}
	return hashString
}

// Find the possible moves from this node and insert them into the tree	
function generateChildren(tree, parent) {
	var moves = getMoves(tree[parent].board)
	var newTeam = 1 - tree[parent].team
	for (var i = 0; i < moves.length; i++) {
		var newNode = insertNode(tree, moves[i], newTeam, parent)
		generateChildren(tree, newNode)
	}
}

// Create a string of lists representing the tree
function printTree(tree, node) {
	printString = tree[node].board.toString()
	printString = printString.concat("<ul>")
	for (var i = 0; i < tree[node].children.length; i++) {
		printString.concat("<li>")
		var child = tree[node].children[i]
		printString = printString.concat(printTree(tree, child))
		printString.concat("</li>")
	}
	printString = printString.concat("</ul>")
	return printString
}

//var tree = {h1:{board:[1,0,1],team:1,value:0,children:[]},
//		h2:{board:[1,2,1],team:0,value:1,children:["h1","h3"]},
//         h3:{board:[1,3,1],team:0,value:1,children:[]}};

var state = {
	board: [1, 2, 3],
	team: 0,
	value: 1,
	children: []
}
var hashString = hashValue(state.board)
var tree = {}
tree[hashString] = state
generateChildren(tree, hashString)

var s = printTree(tree, hashString)