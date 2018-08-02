"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

var bullets = {
    eco:
        { drop: [0, 10, 0, -80, -150, -250],
          speed: [810, 700, 600, 515, 480, 440],
          bc: 0.14, spread: 80, price: 20, weight: 6.5, color:'green'
        },
    deri:
        { drop: [0, 30, 0, -60, -180, -315],
          speed: [550, 516, 470, 426, 407, 389],
          bc: 0.25, spread: 75, price: 25, weight: 13.5, color:'#00ff79'
        },
    kion13:
        { drop: [0, 20, 0, -110, -210, -330],
          speed: [650, 584, 525, 470, 444, 421],
          bc: 0.2, spread: 40, price: 27, weight: 13, color:'grey'
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


function moaSpread(spread) { return ((3.438*spread)/100).toFixed(1); }
function energy(m, v) { return Math.ceil((m*Math.pow(10,-3)*v*v)/2); }


var graphdata0 = [], graphdata1 = [], graphdata2 = [];
for (var key in bullets) {
    graphdata0.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: bullets[key].drop,
        fill: false,
    })
    graphdata1.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: bullets[key].speed,
        fill: false,
    })
    graphdata2.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: bullets[key].speed.map(function(x) {return energy(bullets[key].weight, x)}),
        fill: false,
    })
}



function drop() {

    var config = {
        type: 'line',
        data: {
            labels: [ 0, 50, 100, 150, 175, 200 ],
            datasets: graphdata0,
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: '366TKM'
            },
            tooltips: {
                mode: 'point',
            },
            hover: {
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Дистанция, м'
                    }
                }],
                yAxes: [{
                    display: true,
                    position: 'right',
                    scaleLabel: {
                        display: true,
                        labelString: 'Падение, мм',
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('dropChart').getContext('2d');
    window.mchart = new Chart(ctx, config);
}


function spread() {

    var spreaddata = [{data: [], backgroundColor: []}];
    var labeld = [];
    for (var key in bullets) {
        spreaddata[0].data.push(bullets[key].spread/2)
        spreaddata[0].backgroundColor.push(bullets[key].color)
        labeld.push(key)
    }

    var config = {
        data: {
            datasets: spreaddata,
            labels: labeld,
        },
        options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var sum = 0;
                        return ' ' + data.labels[tooltipItem.index] +': '
                            + tooltipItem.yLabel*2 + ' мм / '
                            + moaSpread(tooltipItem.yLabel*2) + ' MOA';
                    },
                },

            },
            legend: {
                position: 'right',
                display: false,
            },
            title: {
                display: true,
                text: 'Рассеивание на 100м'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                },
                reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        }
    };
    var ctx = document.getElementById('spreadChart');
    window.myPolarArea = Chart.PolarArea(ctx, config);
}

window.onload = function() {
    drop();
    spread();
};



function menuchange() {
 //   var choice = document.querySelector('input[name="bullet"]:checked').value;
    var e = document.getElementById("graphtype");
    var choice = e.options[e.selectedIndex].value;
//  document.getElementById("bc").innerHTML = choice.bc;
//  document.getElementById("muzzle_energy").innerHTML =
//      energy(choice.weight*Math.pow(10,-3), choice.speed[0]);
//  document.getElementById("price").innerHTML = choice.price;

    if (choice=='speed') {
        window.mchart.data.datasets = graphdata1;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Скорость пули, м/с';
        window.mchart.update();
    }
    else if (choice=='energy') {
        window.mchart.data.datasets = graphdata2;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Энергия, джоули';
        window.mchart.update();
    }
    else if (choice=='drop') {
        window.mchart.data.datasets = graphdata0;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Падение, мм';
        window.mchart.update();
    }

}
