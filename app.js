//'use strict'; // Use ECMAScript 5 strict mode in browsers that support it

var drop_graphdata = [],
  speed_graphdata = [],
  energy_graphdata = [],
  visibilityArr = [],
  spreaddata = [{data: [], backgroundColor: []}],
  labeld = [];

const labels_given = [ 0, 50, 100, 150, 175, 200 ],
  tkm = {},
  colors = {
    eco: 'rgba(60,179,113,1)',
    deri: 'rgba(30,144,255,1)',
    kion13: 'rgba(80,80,80,1)',
    kion15: 'rgba(106,90,205,1)',
    sp13: 'rgba(220,20,60,1)',
    fmj: 'rgba(255,140,0,1)',
    etna: 'rgba(191,0,139,1)',
    fmj15: 'rgba(127,70,27,1)',
    fmj15us: 'rgba(76,187,23,1)',
    sp18: 'rgba(255,40,17,1)',
};

const test = [];

function Bullet(name, bc, weight, spread, pricet, pricek, type, drop, speed) {
  this.name = name;
  this.bc = bc;
  this.weight = weight;
  this.spread = spread;
  this.pricek = pricek;
  this.drop = drop;
  this.speed = speed;
  this.pricet = pricet;
  this.type = type;
}

Bullet.prototype = {
  toString: function() { return `Патрон ${this.name}`; }
};


tkm.eco = new Bullet('Эко', 0.14, 6.5, 80, 19, 20, "366",
  [0, 10, 0, -80, -150, -250], [810, 700, 600, 515, 480, 440]);
tkm.deri = new Bullet('Дери', 0.25, 13.5, 75, 24, 25, "366",
  [0, 30, 0, -60, -180, -315], [550, 516, 470, 426, 407, 389]);
tkm.kion13 = new Bullet('Кион&nbsp13', 0.2, 13, 40, 26, 27, "366",
  [0, 20, 0, -110, -210, -330], [650, 584, 525, 470, 444, 421]);
tkm.kion15 = new Bullet('Кион&nbsp15', 0.23, 15, 70, 27, 28, "366",
  [0, 30, 0, -130, -230, -370], [600, 546, 497, 451, 430, 410]);
tkm.sp13 = new Bullet('SP&nbsp13', 0.2, 12.6, 60, 27, 30, "366",
  [0, 20, 0, -120, -230, -370], [620, 545, 490, 434, 409, 388]);
tkm.fmj = new Bullet('FMJ', 0.23, 14, 65, 27, 28, "366",
  [0, 50, 0, -76, -120, -190], [600, 550, 500, 454, 432, 413]);
tkm.etna = new Bullet('Этна', 0.19, 12, 35, null, null, "366",
  [0, 30, 0, -140, -250, -410], [600, 537, 480, 428, 406, 385]);

tkm.fmj15 = new Bullet('FMJ 15', 0.21, 14.8, 60, 31, 33, "96",
  [0, 32, 0, -80, NaN, -208], [770, 694, 628, 565, NaN]);
tkm.fmj15us = new Bullet('FMJ 15 УС', 0.21, 14.8, 60, 31, 33, "96",
  [0, 22, 0, -158, NaN, -333], [571, 516, 467, NaN, NaN]);
tkm.sp18 = new Bullet('SP 18', '0.25?', 18, 80, 34, 36, "96",
  [0, 28, 0, -120, NaN, -235], [658, 605, 557, 518, NaN]);

function ndiscount(value) { window.discount = value * 0.01; }

function moaSpread(spread) { return ((3.438 * spread) / 100).toFixed(1); }

function energy(m, v) { return Math.ceil((m*Math.pow(10, -3) * v * v) / 2); }

function initdata(cartridges) {
  for (let key in cartridges) {
    let dropScatter = [];
    let speedScatter = [];
    let energyScatter = [];
    for (let i = 0; i < labels_given.length; i++) {
      dropScatter.push({
        x: labels_given[i],
        y: cartridges[key].drop[i]
      });
      speedScatter.push({
        x: labels_given[i],
        y: cartridges[key].speed[i]
      });
      energyScatter.push({
        x: labels_given[i],
        y: energy(cartridges[key].weight, cartridges[key].speed[i])
      });
    }
    drop_graphdata.push({
      label: key,
      backgroundColor: colors[key],
      borderColor: colors[key],
      data: dropScatter,
      fill: false,
    });
    speed_graphdata.push({
      label: key,
      backgroundColor: colors[key],
      borderColor: colors[key],
      data: speedScatter,
      fill: false,
    });
    energy_graphdata.push({
      label: key,
      backgroundColor: colors[key],
      borderColor: colors[key],
      data: energyScatter,
      fill: false,
    });
  }
}

function drop() {
  var config = {
    type: 'line',
    data: {
      datasets: drop_graphdata,
    },
    options: {
      spanGaps: true,
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
  const ctx = document.getElementById('ballChart').getContext('2d');
  window.mchart = new Chart(ctx, config);
  window.mchart.aspectRatio = 1;
}


function spread() {
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
          label: (tooltipItem, data) => {
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
        text: 'Кучность на 100м, мм',
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
  const ctx = document.getElementById('spreadChart');
  window.myPolarArea = Chart.PolarArea(ctx, config);
  window.myPolarArea.aspectRatio = 1;
}

function tablegen(cartridges) {
  const table = document.getElementById('mtable');
  const styleElem = document.createElement('style');
  let nolabel = true;

  for (let key in cartridges) {
    if (cartridges[key].type != '366' && nolabel) {
      const sep = table.insertRow(-1);
      const lab = sep.insertCell(-1);
      sep.className = 'hidden';
      lab.style.textAlign = 'center';
      lab.textContent = '9,6/53 Lancaster';
      lab.style.fontWeight = 'bold';
      lab.colSpan = 5;
      nolabel = false;
    }
    const currow = table.insertRow(-1);
    currow.style.textAlign = 'center';
    if (cartridges[key].type != '366') currow.className = 'hidden';
    const cell1 = currow.insertCell(0);
    cell1.innerHTML = cartridges[key].name;
    cell1.style.backgroundColor = colors[key].replace(/1\)$/, '0.5)');
    cell1.style.textAlign = 'left';
    const cell2 = currow.insertCell(1);
    cell2.textContent = cartridges[key].bc;
    const cell3 = currow.insertCell(2);
    cell3.innerHTML = cartridges[key].weight +'&nbspг';
    const cell4 = currow.insertCell(3);
    cell4.id = key;

    test.push(cell4);
    const cell0 = currow.insertCell(0);

    const lbl = document.createElement('label');
    lbl.className = 'custom-checkbox ' + key;
    const chkbx = document.createElement('input');
    chkbx.type = 'checkbox';
    chkbx.className = 'custom-control-input';
    if (cartridges[key].type == '366') chkbx.checked = true;
    chkbx.id = key;
    chkbx.onclick = function() { checkupdate(this.id); };
    const ind = document.createElement('span');
    ind.className = 'custom-control-indicator';

    // dynamic colored sliders
    styleElem.innerHTML += `.${key}`
        + ' .custom-control-input:checked ~ .custom-control-indicator,'
        + `.${key}`
        + ' .custom-control-input:checked ~ .custom-control-indicator:after'
        + `{background-color: ${colors[key]}}`

    lbl.appendChild(chkbx);
    lbl.appendChild(ind);
    cell0.appendChild(lbl);
  }
  document.head.appendChild(styleElem);
}

function updateVisibility() {
  //visibility for dropChart
  for (let i = 0; i < visibilityArr.length; i++) {
    window.mchart.data.datasets[i].hidden = visibilityArr[i];
  }
  window.mchart.update();

  //visibility for spreadChart
  spreaddata[0].data = [];
  spreaddata[0].backgroundColor = [];
  labeld = [];
  let i = 0;
  for (let key in tkm) {
    if (visibilityArr[i] == 0) {
      spreaddata[0].data.push(tkm[key].spread / 2);
      spreaddata[0].backgroundColor.push(colors[key].replace(/1\)$/, '0.6)'));
      labeld.push(key);
    }
    i++;
  }
  if (window.myPolarArea) {
    window.myPolarArea.data.labels = labeld;
    window.myPolarArea.update();
  }
}

function checkupdate(bullet) {
  // function to get number of a called bullet in the dataset
  const i = function() {
    for (let i = 0; i < window.mchart.data.datasets.length; i++) {
      if (window.mchart.data.datasets[i].label == bullet)  return i;
    }
  }();

  if (document.getElementById(bullet).checked == true) {
    visibilityArr[i] = 0;
  } else {
    visibilityArr[i] = 1;
  }
  updateVisibility();
}

function tabchange(choice) {
  setActive(choice);
  if (choice != 'spread') {
    document.getElementById('spreadChart').style.display = 'none';
    document.getElementById('ballChart').style.display = 'initial';

    switch (choice) {
      case 'speed':
        window.mchart.data.datasets = speed_graphdata;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Скорость пули, м/с';
        break;
      case 'energy':
        window.mchart.data.datasets = energy_graphdata;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Энергия, джоули';
        break;
      case 'drop':
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Падение, мм';
        break;
      default:
        throw new Error('Unknown Graph');
    }

  }
  else if (choice == 'spread') {
    if (!window.myPolarArea) spread();
    document.getElementById('ballChart').style.display = 'none';
    document.getElementById('spreadChart').style.display = 'initial';
  }
  updateVisibility();
}

function setActive(name) {
  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(name).className += ' active';
}

function pricecalc() {
  const box = document.getElementById('discobox');

  if (box.checked) {
    ndiscount(document.getElementById('discount').value);
  }
  else {
    ndiscount(0);
  }

  function finalprice(price) {
    return parseFloat((price * (1 - window.discount)).toFixed(2)) +'&nbsp₽';
  }

  if (document.getElementById('temp').checked) {
    test.forEach(function(x) {x.innerHTML = finalprice(tkm[x.id].pricet);});
  } else {
    test.forEach(function(x) {x.innerHTML = finalprice(tkm[x.id].pricek);});
  }
}


function show96(box) {
  if (box.checked) {
    document.getElementById('lanstyle').innerHTML = ''
  }
  else {
    document.getElementById('lanstyle').innerHTML = '.hidden { display:none }'
      for (let key in tkm) {
        if (tkm[key].type != '366') {
          const slider = document.getElementById(key);
          if (slider.checked = true) slider.click();
        }
      }
  }
}

window.onload = function() {
  const hidElem = document.createElement('style');
  hidElem.innerHTML = '.hidden { display:none }';
  hidElem.id = 'lanstyle';
  document.head.appendChild(hidElem);

  document.getElementById('spreadChart').style.display = 'none';
  setActive('drop');

  for (let key in tkm) {
    if (tkm[key].type != '366') {
      visibilityArr.push(1);
    } else {
      visibilityArr.push(0);
    }
  }

  initdata(tkm);
  ndiscount(0);
  tablegen(tkm);
  drop();
  updateVisibility();
  pricecalc();
};
