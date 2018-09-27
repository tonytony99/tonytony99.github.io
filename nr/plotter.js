// volume of water wrt height
function vol(h, r, requiredHeight) {
  return(Math.PI*r*h**2 - (1/3)*Math.PI*h**3 - requiredHeight);
}

// Derivative of volume wrt height
function dvol(h, r) {
  return(Math.PI*2*r*h - Math.PI*h**2);
}


// return the sequence of estimates until convergence
function newtonRaphson(initialGuess, convergenceCriteria, radius, requiredHeight) {
  x = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  x[0] = initialGuess;
  
  for (i=0; i<x.length; i++) {

   x[i+1] = x[i] - vol(x[i], radius, requiredHeight) / dvol(x[i],radius);

   if (Math.abs(x[i+1] - x[i]) < convergenceCriteria) {
      break;
    }
  }
  
  // keep entries up to convergence
  x = x.slice(0,i+1)
  return(x)
}

function newtonRaphsonPlot(initialGuess, convergenceCriteria, radius, v, react) {
	x = newtonRaphson(initialGuess, convergenceCriteria, radius, v);
	y = x.slice(0);
	for (i=0; i<x.length; i++) {
		y[i] = vol(x[i],radius,v) + v;
	}
	h = x[x.length-1];	
	
	var trace1 = {
  		x: x,
  		y: y, 
  	type: 'scatter',
  	name: 'iterative process'
	};
	
	
	// create a plot of the volume function
	var xdisplay = new Array(Math.ceil(2*radius)*5);
	var ydisplay = xdisplay.slice();
	for (i=0; i< 2*radius*5; i++) {
		xdisplay[i] = i/5.0;
		ydisplay[i] = vol(xdisplay[i],radius,v) + v;
	}
	
	// create a plot of the derivative of volume function
	var yddisplay = xdisplay.slice();
	for (i=0; i< 2*radius*5; i++) {
		yddisplay[i] = dvol(xdisplay[i],radius);
	}
	
		
	
	var trace2 = {
  		x: xdisplay, 
  		y: ydisplay, 
   type: 'scatter',
   name: 'Volume vs Height'
	};
	
	var deriv = {
  		x: xdisplay, 
  		y: yddisplay, 
   type: 'scatter',
   name:'Derivative'
	};


	var data = [trace1, trace2];
	
	var layout1 = {
		title : "Water Level vs Volume of Water",
  	   yaxis: {rangemode: 'tozero',
          showline: true,
          zeroline: true,
          title: 'Volume of Water in Tank(mL)'},
     xaxis: {range: [0, radius*2],
     title: 'Height of Water Level (cm)'}
	};
	

	if (react) {
		Plotly.react('div1', data, layout1);
	} else {
		Plotly.newPlot('div1', data, layout1);
	}
	
	$("#heightOutput").val(h.toFixed(2));

}



// update display to show calculation is impossible
function impossible() {
	$("#heightOutput").val("Impossible!");  
	$("#heightOutput").removeClass("blue"); 
	$("#heightOutput").addClass("red"); 
}

// update display to show calculation is possible
function possible() {
	$("#heightOutput").removeClass("red"); 
	$("#heightOutput").addClass("blue"); 
}

convergenceCriteria = 0.0001;


// create the graph
$(document).ready( function() {
  var r = parseFloat($("#radiusInput").val());
  var v = parseFloat($("#volumeInput").val());
  if (v <= vol(2*r,r,0) && r>0 && v>=0) {
  	possible();
  	newtonRaphsonPlot(r, convergenceCriteria, r, v, false);
  } else {
  	impossible();
  }
});

// update the graph
$(document).keyup(function(e) {
  var r = parseFloat($("#radiusInput").val());
  var v = parseFloat($("#volumeInput").val());
  if (v <= vol(2*r,r,0) && r>0 && v>=0) {
  	possible();
  	newtonRaphsonPlot(r, convergenceCriteria, r, v, true);
  } else {
	impossible();
  }
});