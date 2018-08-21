"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

function Bullet(name, bc, weight, spread, price, drop, speed) {
    this.name = name;
    this.bc = bc;
    this.weight = weight;
    this.spread = spread;
    this.price = price;
    this.drop = drop;
    this.speed = speed;
};

Bullet.prototype = {
    toString: function() { return `Патрон $(this.name)`; }
};

const eco = new Bullet("Эко", 0.14, 6.5, 80, 19,
    [0, 10, 0, -80, -150, -250], [810, 700, 600, 515, 480, 440]);
const deri = new Bullet("Дери", 0.25, 13.5, 75, 24,
    [0, 30, 0, -60, -180, -315], [550, 516, 470, 426, 407, 389]);
const kion13 = new Bullet("Кион&nbsp13", 0.2, 13, 40, 26,
    [0, 20, 0, -110, -210, -330], [650, 584, 525, 470, 444, 421]);
const kion15 = new Bullet("Кион&nbsp15", 0.23, 15, 70, 27,
    [0, 30, 0, -130, -230, -370], [600, 546, 497, 451, 430, 410]);
const sp13 = new Bullet("SP&nbsp13", 0.2, 12.6, 60, 27,
    [0, 20, 0, -120, -230, -370], [620, 545, 490, 434, 409, 388]);
const fmj = new Bullet("FMJ", 0.23, 14, 65, 27,
    [0, 50, 0, -76, -120, -190], [600, 550, 500, 454, 432, 413]);
const etna = new Bullet("Этна", 0.19, 12, 35, null,
    [0, 30, 0, -140, -250, -410], [600, 537, 480, 428, 406, 385]);

const tkm366 = {};
tkm366.eco = eco;
tkm366.deri = deri;
tkm366.kion13 = kion13;
tkm366.kion15 = kion15;
tkm366.sp13 = sp13;
tkm366.fmj = fmj;
tkm366.etna = etna;


const bullets = {
    eco:
        { drop: [0, 10, 0, -80, -150, -250],
          speed: [810, 700, 600, 515, 480, 440],
          bc: 0.14, spread: 80, price: 18.05, weight: 6.5,
          color:'rgba(60,179,113,1)',
          name: "Эко",
        },
    deri:
        { drop: [0, 30, 0, -60, -180, -315],
          speed: [550, 516, 470, 426, 407, 389],
          bc: 0.25, spread: 75, price: 22.8, weight: 13.5,
          color:'rgba(30,144,255,1)',
          name: "Дери",
        },
    kion13:
        { drop: [0, 20, 0, -110, -210, -330],
          speed: [650, 584, 525, 470, 444, 421],
          bc: 0.2, spread: 40, price: 24.7, weight: 13,
          color:'rgba(80,80,80,1)',
          name: "Кион&nbsp13",
        },
    kion15:
        { drop: [0, 30, 0, -130, -230, -370],
          speed: [600, 546, 497, 451, 430, 410],
          bc: 0.23, spread: 70, price: 25.65, weight: 15,
          color:'rgba(106,90,205,1)',
          name: "Кион&nbsp15",
        },
    sp13:
        { drop: [0, 20, 0, -120, -230, -370],
          speed: [620, 545, 490, 434, 409, 388],
          bc: 0.2, spread: 60, price: 25.65, weight: 12.6,
          color:'rgba(220,20,60,1)',
          name: "SP&nbsp13",
        },
    fmj:
        { drop: [0, 50, 0, -76, -120, -190],
          speed: [600, 550, 500, 454, 432, 413],
          bc: 0.23, spread: 65, price: 25.65, weight: 14,
          color:'rgba(255,140,0,1)',
          name: "FMJ",
        },
    etna:
        { drop: [0, 30, 0, -140, -250, -410],
          speed: [600, 537, 480, 428, 406, 385],
          bc: 0.19, spread: 35, price: "?", weight: 12,
          color:'rgba(191,0,139,1)',
          name: "Этна",
        },
};

const labels_given = [ 0, 50, 100, 150, 175, 200 ];
var graphdata0 = [];
var graphdata1 = [];
var graphdata2 = [];
var visibilityArr = [];


function moaSpread(spread) { return ((3.438 * spread) / 100).toFixed(1); }

function energy(m, v) { return Math.ceil((m*Math.pow(10, -3) * v * v) / 2); }

function initdata() {

    for (var i = 0; i < Object.keys(bullets).length; i++) {
        visibilityArr.push(0);
    }

    for (var key in bullets) {
        var dropScatter = [];
        var speedScatter = [];
        var energyScatter = [];
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
    }
}

function drop() {

    var config = {
        type: 'line',
        data: {
            datasets: graphdata0,
        },
        options: {
            layout: {
                padding: {
                    top: 10,
                },
            },
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
                intersect: false,
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
    var ctx = document.getElementById('ballChart').getContext('2d');
    window.mchart = new Chart(ctx, config);
    window.mchart.aspectRatio = 1;
}

function spread() {

    var spreaddata = [{data: [], backgroundColor: []}];
    var labeld = [];
    for (var key in bullets) {
        spreaddata[0].data.push(bullets[key].spread / 2);
        spreaddata[0].backgroundColor.push(bullets[key].color.replace(/1\)$/, "0.6)"));
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
                text: 'Рассеивание на 100м, мм',
                position: 'bottom',
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                },
                reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        }
    };
    var ctx = document.getElementById('ballChart');
    window.myPolarArea = Chart.PolarArea(ctx, config);
    window.myPolarArea.aspectRatio = 1;
}

function tablegen() {
    var table = document.getElementById('mtable');
    var i = 1;
    for (var key in bullets) {
        var currow = table.insertRow(i);
        var cell0 = currow.insertCell(0);
        cell0.innerHTML = bullets[key].name;
        cell0.style.backgroundColor = bullets[key].color.replace(/1\)$/, "0.5)");
        var cell1 = currow.insertCell(1);
        cell1.innerHTML = bullets[key].bc;
        cell1.style.textAlign = 'center';
        var cell2 = currow.insertCell(2);
        cell2.innerHTML = bullets[key].weight +'&nbspг';
        cell2.style.textAlign = 'center';
        var cell3 = currow.insertCell(3);
        cell3.innerHTML = bullets[key].price +'&nbsp₽';
        cell3.style.textAlign = 'center';
        var cell4 = currow.insertCell(0);
        cell4.innerHTML = '<input type="checkbox" checked id="'
            + key + '" onclick="checkupdate(this.id);"/>';
        cell4.style.backgroundColor = bullets[key].color;
        i += 1;
    }
}

function updateVisibility() {
    for (var i = 0; i < visibilityArr.length; i++) {
        window.mchart.data.datasets[i].hidden = visibilityArr[i];
    }
}

function checkupdate(bullet) {
    var i = function() {
        for (var i = 0; i < window.mchart.data.datasets.length; i++) {
            if (window.mchart.data.datasets[i].label == bullet) { return i; }
        }
    }();

    if (document.getElementById(bullet).checked == true) {
        visibilityArr[i] = 0;
    } else {
        visibilityArr[i] = 1;
    }

    updateVisibility();
    window.mchart.update();
}

function menuchange() {
    var e = document.getElementById("graphtype");
    var choice = e.options[e.selectedIndex].value;

    if (choice != 'spread') {
        if (window.myPolarArea) {
        window.myPolarArea.destroy();
        window.mchart.destroy();
        drop();
        }

        if (choice == 'speed') {
            window.mchart.data.datasets = graphdata1;
            window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Скорость пули, м/с';
        }
        else if (choice == 'energy') {
            window.mchart.data.datasets = graphdata2;
            window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Энергия, джоули';
        }
        else if (choice == 'drop') {
            window.mchart.data.datasets = graphdata0;
            window.mchart.options.scales.yAxes[0].scaleLabel.labelString = 'Падение, мм';
        }

        updateVisibility();
        window.mchart.update();

    }
    else if (choice == 'spread') {
        if (window.mchart) {
        window.mchart.destroy();
        spread();
        }
    }
}


window.onload = function() {
    if (window.myPolarArea) { window.myPolarArea.destroy(); }
    if (window.mchart) { window.mchart.destroy(); }
    document.getElementById('graphtype').selectedIndex=1;
    tablegen();
    initdata();
    drop();
};
