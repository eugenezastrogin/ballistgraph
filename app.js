"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

var distances = [ 0, 50, 100, 150, 175, 200 ];
var bullets = {
    eco: { drop: [0, 10, 0, -80, -150, -250],
           speed: [810, 700, 600, 515, 480, 440],
           bc: 0.14, spread: 80, price: 19, weight: 6.5 },
deri: { drop: [0, 30, 0, -60, -180, -315], bc:0.25 },
etna: { drop: [0, 30, 0, -140, -250, -410], bc:0.19 }
};
function chart() {
    var hmax = 0, hmin = 0;
    for (var key in bullets) {
        if (Math.max.apply(Math, bullets[key].drop) > hmax) {
            hmax = Math.max.apply(Math, bullets[key].drop)
        }
        if (Math.min.apply(Math, bullets[key].drop) < hmin) {
            hmin = Math.min.apply(Math, bullets[key].drop)
        }
    }
    var dropmod = hmax - hmin
    var graph = document.getElementById('graph'); // Get the <canvas> tag
    graph.width = graph.width;  // Magic to clear and reset the canvas element
    // Get the "context" object for the <canvas> that defines the drawing API
    var g = graph.getContext('2d'); // All drawing is done with this object
    var width = graph.width, height = graph.height; // Get canvas size
    // These functions convert height and distance amounts to pixels
    function distToX(n) { return n * (width/Math.max.apply(Math, distances)); }
    function heigthToY(n) { return (hmax-n)* (height/dropmod); }
    function energy(m, v) { return (m*v*v)/2; }
    // Loop again, as above, but chart loan balance as a thick black line
    g.beginPath();
    g.lineWidth = 2;
    for (var key in bullets) {
        g.moveTo(0,heigthToY(bullets[key].drop[0]));
        for (var p = 0; p <= distances.length; p++) {
            g.lineTo(distToX(distances[p]),heigthToY(bullets[key].drop[p]))
        }
    }
    g.stroke();

    // Now make yearly tick marks and year numbers on X axis
    g.textAlign="center";                          // Center text over ticks
    var y = heigthToY(0);                          // Y coordinate of X axis
    for(var dist=0; dist <= distances.length; dist++) {   // For each distance
        var x = distToX(distances[dist]);                  // Compute tick position
        g.fillRect(x-0.5,y-3,1,3);                 // Draw the tick
        g.fillText(String(distances[dist]), x, y-5);
        if (dist == distances.length-1) g.fillText("Distances", x-30, y-15); // Label the axis
    }
    // Mark payment amounts along the right edge
    g.textAlign = "right";                         // Right-justify text
    g.textBaseline = "middle";                     // Center it vertically
    var ticks = [0, -50, -100, -200];     // The two points we'll mark
    var rightEdge = distToX(distances[-2]);          // X coordinate of Y axis
    for(var i = 0; i < ticks.length; i++) {        // For each of the 2 points
        var y = heigthToY(ticks[i]);               // Compute Y position of tick
        g.fillRect(rightEdge-3, y-0.5, 3,1);       // Draw the tick mark
        g.fillText(String(ticks[i].toFixed(0)),    // And label it.
                   rightEdge-5, y);
    }
}
chart();

function validate() {
    var choice = document.querySelector('input[name="bullet"]:checked').value;
   // alert(choice);
    document.getElementById("bc").innerHTML = bullets[choice].bc;
}
