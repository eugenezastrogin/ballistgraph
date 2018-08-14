"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const bullets = {
    eco:
        { drop: [0, 10, 0, -80, -150, -250],
          speed: [810, 700, 600, 515, 480, 440],
          bc: 0.14, spread: 80, price: 18.05, weight: 6.5, color:'mediumseagreen',
          name: "Эко",
        },
    deri:
        { drop: [0, 30, 0, -60, -180, -315],
          speed: [550, 516, 470, 426, 407, 389],
          bc: 0.25, spread: 75, price: 22.8, weight: 13.5, color:'dodgerblue',
          name: "Дери",
        },
    kion13:
        { drop: [0, 20, 0, -110, -210, -330],
          speed: [650, 584, 525, 470, 444, 421],
          bc: 0.2, spread: 40, price: 24.7, weight: 13, color:'grey',
          name: "Кион 13",
        },
    kion15:
        { drop: [0, 30, 0, -130, -230, -370],
          speed: [600, 546, 497, 451, 430, 410],
          bc: 0.23, spread: 70, price: 25.65, weight: 15, color:'slateblue',
          name: "Кион 15",
        },
    sp13:
        { drop: [0, 20, 0, -120, -230, -370],
          speed: [620, 545, 490, 434, 409, 388],
          bc: 0.2, spread: 60, price: 25.65, weight: 12.6, color:'#dc143c',
          name: "SP 13",
        },
    fmj:
        { drop: [0, 50, 0, -76, -120, -190],
          speed: [600, 550, 500, 454, 432, 413],
          bc: 0.23, spread: 65, price: 25.65, weight: 14, color:'#ff8c00',
          name: "FMJ",
        },
    etna:
        { drop: [0, 30, 0, -140, -250, -410],
          speed: [600, 537, 480, 428, 406, 385],
          bc: 0.19, spread: 35, price: "?", weight: 12, color:'#BF008b',
          name: "Этна",
        },
};


function moaSpread(spread) { return ((3.438 * spread) / 100).toFixed(1); }
function energy(m, v) { return Math.ceil((m*Math.pow(10, -3) * v * v) / 2); }
function speedFromBC (D2, V1, BC) {
    if (D2 == 50) {
        return 
    }
    const K = 0.005283;
    return Math.pow(Math.sqrt(V1) - (K * D2) / BC, 2);
}

const labels_given = [ 0, 50, 100, 150, 175, 200 ];
const labels_theory = [0,50,100,150,200,250,300];
var graphdata0 = [];
var graphdata1 = [];
var graphdata2 = [];
var graphdata3 = [];
for (var key in bullets) {
    var dropScatter = [];
    var speedScatter = [];
    var energyScatter = [];
    var speedTheoryScatter = [];
    for (var i = 0; i < labels_given.length; i++) {
        dropScatter.push({
            x:labels_given[i],
            y:bullets[key].drop[i]
        });
        speedScatter.push({
            x:labels_given[i],
            y:bullets[key].speed[i]
        });
        energyScatter.push({
            x:labels_given[i],
            y:energy(bullets[key].weight, bullets[key].speed[i])
        });
        speedTheoryScatter.push({
            x:labels_given[i],
            y:speedFromBC(labels_given[i], bullets[key].speed[0], bullets[key].bc )
        });
    }
    graphdata0.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: dropScatter,
        fill: false,
    });
    graphdata1.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: speedScatter,
        fill: false,
    });
    graphdata2.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: energyScatter,
        fill: false,
    });
    graphdata3.push({
        label: key,
        backgroundColor: bullets[key].color,
        borderColor: bullets[key].color,
        data: speedTheoryScatter,
        fill: false,
    })
}


function drop() {

    var config = {
        type: 'line',
        data: {
            datasets: graphdata0,
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
                display: false,
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
                    ticks: {
                        maxTicksLimit: 6,
                    },
                    type: 'linear',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Дистанция, м'
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMax: 75,
                    },
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
        spreaddata[0].data.push(bullets[key].spread / 2);
        spreaddata[0].backgroundColor.push(bullets[key].color);
        labeld.push(key)
    }

    var config = {
        data: {
            datasets: spreaddata,
            labels: labeld,
        },
        options: {
            layout: {
                padding: {
                    top: 10,
                },
            },
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var sum = 0;
                        return ' ' + data.labels[tooltipItem.index] +': '
                            + tooltipItem.yLabel * 2 + ' мм / '
                            + moaSpread(tooltipItem.yLabel * 2) + ' MOA';
                    },
                },

            },
            legend: {
                position: 'right',
                display: false,
            },
            title: {
                display: true,
                text: 'Рассеивание на 100м',
                position: 'bottom',
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 50,
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


function tablegen() {
    var table = document.getElementById('mtable');
    var i = 1;
    for (var key in bullets) {
        var currow = table.insertRow(i);
        var cell0 = currow.insertCell(0);
        cell0.innerHTML = bullets[key].name;
        cell0.style.backgroundColor = bullets[key].color;
        var cell1 = currow.insertCell(1);
        cell1.innerHTML = bullets[key].bc;
        var cell2 = currow.insertCell(2);
        cell2.innerHTML = bullets[key].weight +'г';
        var cell3 = currow.insertCell(3);
        cell3.innerHTML = bullets[key].price +'₽';
        i += 1;
    }
}


function menuchange() {
    var e = document.getElementById("graphtype");
    var choice = e.options[e.selectedIndex].value;

    if (choice == 'speed') {
        window.mchart.data.datasets = graphdata1;
        window.mchart.data.labels = labels_given;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Скорость пули, м/с';
        window.mchart.update();
    }
    else if (choice == 'speedTheory') {
        window.mchart.data.datasets = graphdata3;
        window.mchart.data.labels = labels_theory;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Скорость пули, м/с';
        window.mchart.update();
    }
    else if (choice == 'energy') {
        window.mchart.data.datasets = graphdata2;
        window.mchart.data.labels = labels_given;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Энергия, джоули';
        window.mchart.update();
    }
    else if (choice == 'drop') {
        window.mchart.data.datasets = graphdata0;
        window.mchart.data.labels = labels_given;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Падение, мм';
        window.mchart.update();
    }
}


window.onload = function() {
    drop();
    spread();
    tablegen();
};
