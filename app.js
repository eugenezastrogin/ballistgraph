"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

var distances = [ 0, 50, 100, 150, 175, 200 ];
var bullets = {
    eco:
        { drop: [0, 10, 0, -80, -150, -250],
          speed: [810, 700, 600, 515, 480, 440],
          bc: 0.14, spread: 80, price: 20, weight: 6.5, color:'#00ff7f'
        },
    deri:
        { drop: [0, 30, 0, -60, -180, -315],
          speed: [550, 516, 470, 426, 407, 389],
          bc: 0.25, spread: 75, price: 25, weight: 13.5, color:'#40e0d0'
        },
    kion13:
        { drop: [0, 20, 0, -110, -210, -330],
          speed: [650, 584, 525, 470, 444, 421],
          bc: 0.2, spread: 40, price: 27, weight: 13, color:'#ff2000'
        },
    kion15:
        { drop: [0, 30, 0, -130, -230, -370],
          speed: [600, 546, 497, 451, 430, 410],
          bc: 0.23, spread: 70, price: 28, weight: 15, color:'#4682b4'
        },
    sp13:
        { drop: [0, 20, 0, -120, -230, -370],
          speed: [620, 545, 490, 434, 409, 388],
          bc: 0.2, spread: 60, price: 28, weight: 12.6, color:'#dc143c'
        },
    fmj:
        { drop: [0, 50, 0, -76, -120, -190],
          speed: [600, 550, 500, 454, 432, 413],
          bc: 0.23, spread: 65, price: 28, weight: 14, color:'#ff8c00'
        },
    etna:
        { drop: [0, 30, 0, -140, -250, -410],
          speed: [600, 537, 480, 428, 406, 385],
          bc: 0.19, spread: 35, price: 30, weight: 12, color:'#8b008b'
        },
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
    function heigthToY(n) { var offset = 10; return (offset+hmax-n)* (height/(dropmod+2*offset)); }
    g.lineWidth = 1.5;
    for (var key in bullets) {
        g.strokeStyle = bullets[key].color;
        g.beginPath();
        g.moveTo(0,heigthToY(bullets[key].drop[0]));
        for (var p = 0; p <= distances.length; p++) {
            g.lineTo(distToX(distances[p]),heigthToY(bullets[key].drop[p]))
        }
        g.stroke();
    }

    // Now make yearly tick marks and year numbers on X axis
    g.textAlign="center";                          // Center text over ticks
    var y = heigthToY(0);                          // Y coordinate of X axis
    for(var dist=0; dist <= distances.length; dist++) {   // For each distance
        var x = distToX(distances[dist]);                  // Compute tick position
        g.fillRect(x-0.5,y-3,1,3);                 // Draw the tick
        g.fillText(String(distances[dist]), x, y-5);
        if (dist == distances.length-1) g.fillText("Дистанция, м", x-30, y-15); // Label the axis
    }
    // Mark drops along the right edge
    g.textAlign = "right";                         // Right-justify text
    g.textBaseline = "middle";                     // Center it vertically
    for (var key in bullets) {
        var rightEdge = distToX(distances[distances.length-1]);          // X coordinate of Y axis
        var ldrop = bullets[key].drop[distances.length-1]
        var y = heigthToY(ldrop);               // Compute Y position of tick
        g.fillRect(rightEdge-3, y-0.5, 3,1);       // Draw the tick mark
        g.fillText(String(ldrop),    // And label it.
                   rightEdge-5, y);
        g.fillText(String(key),    // And label it.
                   rightEdge-5, y-10);
        }
}
chart();

function energy(m, v) { return Math.ceil((m*v*v)/2); }

function moaSpread(spread) { return ((3.438*spread)/100).toFixed(1); }

function validate() {
    var choice = bullets[document.querySelector('input[name="bullet"]:checked').value];
   // alert(choice);
    document.getElementById("bc").innerHTML = choice.bc;
    document.getElementById("spread").innerHTML = choice.spread
        + 'mm / ' + moaSpread(choice.spread);
    document.getElementById("muzzle_energy").innerHTML =
        energy(choice.weight*Math.pow(10,-3), choice.speed[0]);
    document.getElementById("price").innerHTML = choice.price;
}
