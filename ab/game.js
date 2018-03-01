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

// Get the index of the maximal element of array
function indexOfMax(array) {
	var maxElement = array[0]
	var maxIndex = 0
	for (var i = 0;i<array.length;i++){
		if (array[i]>maxElement) {
			maxElement = array[i]
			maxIndex = i
		}
	}
	return maxIndex
}

// wait for ms milliseconds
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// call sum = [1, 2, 3].reduce(add, 0);
function add(a, b) {
    return a + b;
}

// return the number of pieces on the board
function boardSum(board) {
	return board.reduce(add, 0)
}

// Compute a string from a board to be used in a hash table
function hashValue(board,maximisingPlayer) {
	var hashString = "B=";
	var boardHist = hist(board)
	hashString = hashString.concat(boardHist.join()," P=",maximisingPlayer);
	return hashString;
}

// Return an array of resulting board positions
function getMoves(board) {
	var newState = [];
	var moves = [];
	var onesAllowed = numOccurrences(board,0) < (board.length - 1)
	for (var i = 0; i < board.length; i++) {
		if (board[i] > 1 || (onesAllowed && board[i] >= 1)) {
			if (onesAllowed) {
				for (var j = 1; j <= board[i]; j++) {
					newState = board.slice();
					newState[i] -= j;
					moves.push(newState.slice());
				}
			} else {
				for (var j = 1; j < board[i]; j++) {
					newState = board.slice();
					newState[i] -= j;
					moves.push(newState.slice());
				}
			}
		}
	}
	return moves;
}

// Insert a node into the tree
function newNode(board, team) {
	var state = {
		board: board,
		moves: getMoves(board),
		team: team,
		value: "?",
		children: [],
		a: "?",
		b: "?"
	}
	return state
}

// Insert a child for each move from this node
function generateChildren(parent) {
	if (parent == null) {return null}
	var newTeam = 1 - parent.team
	for (var i = 0; i < parent.moves.length; i++) {
		var child = newNode(parent.moves[i],newTeam)
		if(child != null)	parent.children.push(child)
	}
	return parent
}

function getValue(node, player) {
	if (numOccurrences(node.board,0) == (node.board.length - 1) &&  
													numOccurrences(node.board,1) == 1) {
		// if the maximising player loses then value -1
		if (player == 1) {
			node.value = -1
			return node.value
		}	
		// if the minimising player loses then value +1
		else {
			node.value = 1
			return node.value
		}	
	} else { return 0}
}


// a : minimum score that the maximising player is guaranteed
// b : maximum score that the minimising player is guaranteed
function alphabeta(node, depth, a, b, maximisingPlayer, initialNode){
	// if we already know the value of this board, then return it 
	if (knownBoardScores[hashValue(node.board,maximisingPlayer)]) {
		node.value = knownBoardScores[hashValue(node.board,maximisingPlayer)]
		return knownBoardScores[hashValue(node.board,maximisingPlayer)]
	}	
	
	// If maximum depth or node is terminal	
	if (depth == 0 || node.moves.length == 0) {
		var value = getValue(node, maximisingPlayer)
		if(node.moves.length == 0) {
			knownBoardScores[hashValue(node.board,maximisingPlayer)] = value
		}
		return value
	}	
	
	// If the node has no children yet, then create them
	if(node.children.length == 0) {
		node = generateChildren(node)
	}	

	node.a = a
	node.b = b
	
	// If it's our turn, then maximise the score		
	if (maximisingPlayer == 1) {
		node.value = - 1
		// For each child of this node
		for (var i = 0; i<node.children.length; i++) {
			// The value of the child
			node.value = Math.max(node.value, alphabeta(node.children[i], depth - 1, a, b, 0, initialNode))
			a = Math.max(a,node.value)
			node.a = a		
			// The minimising player is guaranteed a better (lower) score already
			if (b<= a) {
				break		
			}
		}
		if (node.value !== 0) {
			knownBoardScores[hashValue(node.board,maximisingPlayer)] = node.value
		}
		return node.value
	}
	// If it's opponents turn, then minimise the score
	else {
		node.value = 1
		// For each child of this node
		for (var i = 0; i<node.children.length; i++) {
			// The value of the child
			node.value = Math.min(node.value, alphabeta(node.children[i], depth - 1, a, b, 1, initialNode))
			b = Math.min(b,node.value)
			node.b = b
			// The maximising player is guaranteed a better (higher) score already
			if (b<= a) {
				break		
			}
		}
		if (node.value !== 0) {
			knownBoardScores[hashValue(node.board,maximisingPlayer)] = node.value
		}
		return node.value
	}
}

function getBestMove(boardNode) {
	knownBoardScores = {}
	alphabeta(boardNode,15,-1,1,1,boardNode)
	var bestMove = boardNode.moves[0]
	var bestMoveValue = -1
	for (var i=0; i<boardNode.children.length; i++) {
		if (boardNode.children[i].value > bestMoveValue) {
				bestMove = boardNode.moves[i]
				bestMoveValue = boardNode.children[i].value
		}
	}
	return bestMove
}	


var knownBoardScores = {}
var team = 0

var gameState;
newGame()


function gameOver() {
	if (gameState.board == null) return 1
	return numOccurrences(gameState.board,0) == gameState.board.length-1 
	&& numOccurrences(gameState.board,1) == 1
}

function isGameover() {
	if (gameOver()) {
		if (gameState.turn == 1) {
			$("#turn").html("You Lose")
			$("#help").html("Hint : you were left with the final cell")
		} else {
			$("#turn").html("You Win")
			$("#help").html("Hint : the bot was left with the final cell")
		}
		$("#turn").append("<button onclick='newGame()'> New Game </button>")	
		return 1
	}
	return 0
}

function newGame() {
	var board = [1,2,3,4,5]
	var boardNode = newNode(board,1)
	$("#turn").html("Your Turn")
	$("#help").html("Hint : click a cell to remove all cells below it.")
	gameState = {turn:1, tree:boardNode, board: board}
	drawBoard(gameState.board)
}


function highlightBelow(cell) {
	if (gameState.turn == 0) return;
	cellId = cell.id.split("-")
	cellX = + cellId[0]
	cellY = + cellId[1]
	for (var y = cellY; y>0; y--) {
		var cellStringId = "".concat("#",cellX,"-",y)
		$(cellStringId).attr("class", "highlighted-grid-cell")
	}	
}

function unHighlightBelow(cell) {
	if (gameState.turn == 0) return;
	cellId = cell.id.split("-")
	cellX = + cellId[0]
	cellY = + cellId[1]
	for (var y = cellY; y>0; y--) {
		var cellStringId = "".concat("#",cellX,"-",y)
		$(cellStringId).attr("class", "grid-cell")
	}	
}

async function botRemoveBelow(newBoard) {
	if (newBoard == null) {
		isGameover()
		return
	}
	for (x = 0; x<newBoard.length; x++) {
		if (newBoard[x] != gameState.board[x]) {
			for (var y = gameState.board[x]; y >= newBoard[x]; y--) {
				var cellStringId = "".concat("#",x,"-",y)
				$(cellStringId).fadeOut("fast",function() {drawBoard(newBoard)});
			}
		}
	}
	gameState.turn = 1
	$("#turn").html("Your Turn")
	isGameover()
}

async function removeBelow(cell) {
	if (gameState.turn == 0) return;
	cellId = cell.id.split("-")
	cellX = + cellId[0]
	cellY = + cellId[1]
	for (var y = cellY; y>0; y--) {
		var cellStringId = "".concat("#",cellX,"-",y)
		$(cellStringId).fadeOut("fast",function() {drawBoard(gameState.board)});
	}
	gameState.board[cellX] -= cellY
	gameState.turn = 0
	$("#turn").html("Bot's Turn")
	var root = {
		board: gameState.board,
		moves: getMoves(gameState.board),
		team: 0,
		value: 0,
		children: [],
		a: -1,
		b: 1
	}
	var bestMove = getBestMove(root)
	
	$("#help").html("Hint : wait for the bot to make a move")
	d3.selectAll("svg > *").remove();
	// NOT SUPPORTED	
	await sleep(600);
	if(boardSum(root.board) < 15) {
		// rough estimate of how to rescale the tree
		$("#treeContainer").css("height","".concat(120*boardSum(root.board),"px"))
		update(root)
	}
	// NOT SUPPORTED
	await sleep(600);
	botRemoveBelow(bestMove)
	gameState.board = bestMove
	$("#help").html("Hint : click a cell to remove it and all cells below")
	isGameover()
}

function drawBoard(board) {
	var boardContainer = $("#boardContainer");
	boardContainer.html('');
	for (var x=0; x<board.length; x++) {
		var colString = "".concat("<div class=grid-col id='grid-col-",x,"'>")
		var colStringId = "".concat("#grid-col-",x)
		boardContainer.append(colString)
		for (var y=board.length; y>0; y--) {
			var cellString = "".concat(x,"-",y)
			var cellStringId = "".concat("#",cellString)
			if(board[x]>=y) {
				$(colStringId).append("".concat("  <div class='grid-cell' id='",cellString,"'>"))
			} else {
				$(colStringId).append("<div class='empty-grid-cell'>")
			}
			$(cellStringId).on({
				mouseenter: function() {highlightBelow(this)}, 
				mouseleave: function() {unHighlightBelow(this)},
				click: function() {removeBelow(this)},
			});
		}
	}
}

function update(source) {		
	var margin = {top: 10, right: 60, bottom: 10, left: 60}
	var treeContainer = document.getElementById("treeContainer")
	var width = treeContainer.clientWidth - margin.right
	var height = treeContainer.clientHeight
	var i = 0;

	var tree = d3.layout.tree()
	 .size([height, width]);

	var diagonal = d3.svg.diagonal()
	 .projection(function(d) { return [d.y, d.x]; });

	$("#treeContainer").html('')
	 
	var svg = d3.select("#treeContainer").append("svg")
		.attr("width", width)
		.attr("height", height+10)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Compute the new tree layout.
  var nodes = tree.nodes(source).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 70; });

  // Declare the nodes
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("rect")
    .attr("width",50)
    .attr("height",14)
    .attr("y", -11)
    .attr("x", -23)
    .style("stroke-width", 2)
    .style("stroke", function(d) {return d.team==team ? "green":"blue";})
    .style("fill",function(d) { if(d.value == "?"){return "white"} return d.value > 0 ? "lightgreen":"coral"; })
    .style("fill-opacity", 1);
		

  nodeEnter.append("text")
   .attr("text-anchor", "middle")
   .text(function(d) { return "".concat(d.board); })
   .style("font-size","11px")
   .style("fill-opacity", 1);

  // Declare the links
  var link = svg.selectAll(".link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  var linkEnter = link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}
