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
		value: 0,
		children: [],
		a: -100,
		b: 100
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
		if (player == 1) {
			node.value = -1
			node.a = node.value
			node.b = node.value
			return node.value
		}	else {
			node.value = 1
			node.a = node.value
			node.b = node.value
			return node.value
		}	
	}
}

// a : minimum score that the maximising player is guaranteed
// b : maximum score that the minimising player is guaranteed
function alphabeta(node, depth, a, b, maximisingPlayer,team){
	
	// If maximum depth or node is terminal	
	if (depth == 0 || node.moves.length == 0) {
		console.log(maximisingPlayer)
		var value = getValue(node, team)
		return value
	}

	if(node.children.length == 0) {
		node = generateChildren(node)
	}	
		
	// If it's our turn, then maximise the score		
	if (maximisingPlayer == 1) {
		node.value = - 100
		// For each child of this node
		for (var i = 0; i<node.children.length; i++) {
			// The value of the child
			node.value = Math.max(node.value, alphabeta(node.children[i], depth - 1, a, b, 1 - maximisingPlayer, team))
			a = Math.max(a,node.value)
			node.a = a
			node.b = b			
			// The minimising player is guaranteed a better (lower) score already
			if (b<= a) {
				break		
			}
		}
		return node.value
	}
	// If it's opponents turn, then minimise the score
	else {
		node.value = 100
		// For each child of this node
		for (var i = 0; i<node.children.length; i++) {
			// The value of the child
			node.value = Math.min(node.value, alphabeta(node.children[i], depth - 1, a, b, 1 - maximisingPlayer, team))
			b = Math.min(b,node.value)
			node.b = b
			node.a = a
			// The maximising player is guaranteed a better (higher) score already
			if (b<= a) {
				break		
			}
		}
		return node.value
	}
}

var team = 0

var root = {
	board: [1,2,1],
	moves: getMoves([1,2,1]),
	team: team,
	value: 0,
	children: [],
	a: -100,
	b: 100
}


var treeData = root
var res = alphabeta(root,9,-100,100,1,team)
console.log(root)
console.log(res)

var treeData = root


// ************** Generate the tree diagram  *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
 width = 960 - margin.right - margin.left,
 height = 500 - margin.top - margin.bottom;
 
var i = 0;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
 .attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData;
  
update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 150; });

  // Declare the nodes
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("rect")
    //.attr("r", 17)
    .attr("width",100)
    .attr("height",14)
    .attr("y", -10)
    .attr("x", -50)
    .style("stroke-width", 2)
    .style("stroke", function(d) {return d.team==team ? "green":"blue";})
    .style("fill",function(d) { if(d.value == 0){return "white"} return d.value > 0 ? "lightgreen":"coral"; })
    .style("fill-opacity", 1);
		

  nodeEnter.append("text")
   .attr("text-anchor", "middle")
   .text(function(d) { return "".concat(d.board," a:",d.a," b:",d.b); })
   .style("font-size","10px")
   .style("fill-opacity", 1);

  // Declare the links
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}