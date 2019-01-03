'use strict'; // Use ECMAScript 5 strict mode in browsers that support it
import Chart from 'chart.js/dist/Chart.min.js';
import Data from './data.json';
import './style.css';

// Classes

class Color {
  constructor([red, green, blue]) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  toChart(transparency = 1) {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${transparency})`
  }
}

class Bullet {
  constructor({name, type, bc, weight, spread, pricetkm, pricetemp, drop, speed, color}) {
    this.name = name;
    this.type = type;
    this.bc = bc;
    this.weight = weight;
    this.spread = spread;
    this.pricetemp = pricetemp;
    this.drop = drop;
    this.speed = speed;
    this.pricetkm = pricetkm;
    this.color = new Color(color);
  }
}

class PriceCell {
  constructor(node, bullet) {
    this.node = node;
    this.bullet = bullet;
  }

  update(x) {
    this.node.innerHTML = x;
  }
}

class DiscountData {
  constructor() {
    this.shop = 'temp';
    this.discountActive = false;
    this.discount = 0;
    this.observers = [];
  }

  registerObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      let ob = this.observers.indexOf(observer);
      this.observers.splice(ob,1);
    }
  }

  applyDiscount() {
    this.discountActive = true;
  }

  basePrice() {
    this.discountActive = false;
  }

  setDiscount(x) {
    this.discount = x * 0.01;
  }

  setShop(shop) {
    this.shop = shop;
  }

  notifyObservers() {
    for (let observer of this.observers) {
      let price;
      if (this.shop === 'temp') {
        price = observer.bullet.pricetemp;
      } else {
        price = observer.bullet.pricetkm;
      }
      if (this.discountActive) {
        price = price * (1 - this.discount);
      }

      const finalprice = (x) => {
        if (x !== null) {
          return parseFloat(x.toFixed(2)) +'&nbsp₽';
        } else {
          return 0 +'&nbsp₽';
        }
      }
      observer.update(finalprice(price));
    }
  }
}

// Variables
let dropGraphdata = [];
let speedGraphdata = [];
let energyGraphdata = [];
let visibilityArr = [];
let spreadData = [{data: [], backgroundColor: []}];
let labelD = [];

// Constants
const LABELS_GIVEN = [ 0, 50, 100, 150, 175, 200 ];
const DISCOUNT_OBJ = new DiscountData();
const TKM = {};

// Functions
function moaSpread(spread) { return ((3.438 * spread) / 100).toFixed(1); }

function energy(m, v) { return Math.ceil((m*Math.pow(10, -3) * v * v) / 2); }

function initData(cartridges) {
  for (let key in cartridges) {
    let dropScatter = [];
    let speedScatter = [];
    let energyScatter = [];

    for (let i = 0; i < LABELS_GIVEN.length; i++) {
      dropScatter.push({
        x: LABELS_GIVEN[i],
        y: cartridges[key].drop[i]
      });
      speedScatter.push({
        x: LABELS_GIVEN[i],
        y: cartridges[key].speed[i]
      });
      energyScatter.push({
        x: LABELS_GIVEN[i],
        y: energy(cartridges[key].weight, cartridges[key].speed[i])
      });
    }
    dropGraphdata.push({
      label: key,
      backgroundColor: TKM[key].color.toChart(),
      borderColor: TKM[key].color.toChart(),
      data: dropScatter,
      fill: false,
    });
    speedGraphdata.push({
      label: key,
      backgroundColor: TKM[key].color.toChart(),
      borderColor: TKM[key].color.toChart(),
      data: speedScatter,
      fill: false,
    });
    energyGraphdata.push({
      label: key,
      backgroundColor: TKM[key].color.toChart(),
      borderColor: TKM[key].color.toChart(),
      data: energyScatter,
      fill: false,
    });
  }
}

function drop() {
  var config = {
    type: 'line',
    data: {
      datasets: dropGraphdata,
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

  const CTX = document.getElementById('ballChart').getContext('2d');
  window.mchart = new Chart(CTX, config);
  window.mchart.aspectRatio = 1;
}

function spread() {
  var config = {
    data: {
      datasets: spreadData,
      labels: labelD,
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
  const CTX = document.getElementById('spreadChart');
  window.myPolarArea = Chart.PolarArea(CTX, config);
  window.myPolarArea.aspectRatio = 1;
}

function tableGenerate(cartridges) {
  const TABLE = document.getElementById('mtable');
  let tbl = document.createElement('table');
  tbl.setAttribute('class', 'mtab');
  tbl.setAttribute('id', 'mtable');
  let headers = tbl.insertRow(0);
  headers.style.fontWeight = 'bold';
  headers.style.textAlign = 'center';
  let c0 = headers.insertCell(0);
  c0.innerHTML = '';
  let c1 = headers.insertCell(1);
  c1.innerHTML = 'Патрон';
  let c2 = headers.insertCell(2);
  c2.innerHTML = '<abbr title="Баллистический коэффициент">BC</abbr>';
  let c3 = headers.insertCell(3);
  c3.innerHTML = 'Масса';
  let c4 = headers.insertCell(4);
  c4.innerHTML = 'Цена';
  const styleElem = document.createElement('style');
  let oneShot = false;

  for (let key in cartridges) {
    if (cartridges[key].type !== '366' && !oneShot) {
      let separator = tbl.insertRow(-1);
      let labelLancaster = separator.insertCell(-1);
      separator.className = 'hidden';
      labelLancaster.style.textAlign = 'center';
      labelLancaster.textContent = '9,6/53 Lancaster';
      labelLancaster.style.fontWeight = 'bold';
      labelLancaster.colSpan = 5;
      oneShot = true;
    }
    let currentRow = tbl.insertRow(-1);
    currentRow.style.textAlign = 'center';
    if (cartridges[key].type !== '366') currentRow.className = 'hidden';
    let cell1 = currentRow.insertCell(0);
    cell1.innerHTML = cartridges[key].name;
    cell1.style.backgroundColor = TKM[key].color.toChart(0.5);
    cell1.style.textAlign = 'left';
    let cell2 = currentRow.insertCell(1);
    cell2.textContent = cartridges[key].bc;
    let cell3 = currentRow.insertCell(2);
    cell3.innerHTML = cartridges[key].weight +'&nbspг';
    let cell4 = currentRow.insertCell(3);

    let observ = new PriceCell(cell4, cartridges[key]);
    DISCOUNT_OBJ.registerObserver(observ);

    let cell0 = currentRow.insertCell(0);

    let lbl = document.createElement('label');
    lbl.className = 'custom-checkbox ' + key;
    let chkbx = document.createElement('input');
    chkbx.type = 'checkbox';
    chkbx.className = 'custom-control-input';
    if (cartridges[key].type === '366') chkbx.checked = true;
    chkbx.id = key;
    chkbx.onclick = function() {checkupdate(this.id);};
    let ind = document.createElement('span');
    ind.className = 'custom-control-indicator';

    // dynamic colored sliders
    styleElem.innerHTML += `.${key}`
        + ' .custom-control-input:checked ~ .custom-control-indicator,'
        + `.${key}`
        + ' .custom-control-input:checked ~ .custom-control-indicator:after'
        + `{background-color: ${TKM[key].color.toChart()}}`;

    lbl.appendChild(chkbx);
    lbl.appendChild(ind);
    cell0.appendChild(lbl);
  }
  document.head.appendChild(styleElem);
  document.getElementById('mt').appendChild(tbl);
}

function updateVisibility() {
  //visibility for dropChart
  for (let i = 0; i < visibilityArr.length; i++) {
    window.mchart.data.datasets[i].hidden = visibilityArr[i];
  }
  window.mchart.update();

  //visibility for spreadChart
  spreadData[0].data = [];
  spreadData[0].backgroundColor = [];
  labelD = [];
  let i = 0;
  for (let key in TKM) {
    if (visibilityArr[i] === 0) {
      spreadData[0].data.push(TKM[key].spread / 2);

      spreadData[0].backgroundColor.push(TKM[key].color.toChart(0.6));
      labelD.push(key);
    }
    i++;
  }
  if (window.myPolarArea) {
    window.myPolarArea.data.labels = labelD;
    window.myPolarArea.update();
  }
}

function checkupdate(bullet) {
  // function to get number of a called bullet in the dataset
  const i = function() {
    for (let i = 0; i < window.mchart.data.datasets.length; i++) {
      if (window.mchart.data.datasets[i].label === bullet) return i;
    }
  }();

  if (document.getElementById(bullet).checked === true) {
    visibilityArr[i] = 0;
  } else {
    visibilityArr[i] = 1;
  }
  updateVisibility();
}

function tabChange(choice) {
  setActive(choice);
  if (choice !== 'spread') {
    document.getElementById('spreadChart').style.display = 'none';
    document.getElementById('ballChart').style.display = 'initial';

    switch (choice) {
      case 'speed':
        window.mchart.data.datasets = speedGraphdata;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Скорость пули, м/с';
        break;
      case 'energy':
        window.mchart.data.datasets = energyGraphdata;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Энергия, джоули';
        break;
      case 'drop':
        window.mchart.data.datasets = dropGraphdata;
        window.mchart.options.scales.yAxes[0].scaleLabel.labelString =
            'Падение, мм';
        break;
      default:
        throw new Error('Unknown Graph');
    }
  }
  else if (choice === 'spread') {
    if (!window.myPolarArea) spread();
    document.getElementById('ballChart').style.display = 'none';
    document.getElementById('spreadChart').style.display = 'initial';
  }
  updateVisibility();
}

function setActive(name) {
  const TABLINKS = document.getElementsByClassName('tablinks');
  for (let i = 0; i < TABLINKS.length; i++) {
    TABLINKS[i].className = TABLINKS[i].className.replace(' active', '');
  }
  document.getElementById(name).className += ' active';
}

function priceUpdate() {
  if (document.getElementById('temp').checked) {
    DISCOUNT_OBJ.setShop('temp');
  } else {
    DISCOUNT_OBJ.setShop('tkm');
  }

  DISCOUNT_OBJ.setDiscount(document.getElementById('discount').value);

  if (document.getElementById('discobox').checked) {
    DISCOUNT_OBJ.applyDiscount();
  }
  else {
    DISCOUNT_OBJ.basePrice();
  }
  DISCOUNT_OBJ.notifyObservers();
}

function show96(box) {
  if (box.checked) {
    document.getElementById('lanstyle').innerHTML = ''
  }
  else {
    document.getElementById('lanstyle').innerHTML = '.hidden { display:none }';
    for (let key in TKM) {
      if (TKM[key].type !== '366') {
        let slider = document.getElementById(key);
        if (slider.checked = true) slider.click();
      }
    }
  }
}

window.onload = function() {

  for (let bullet in Data) {
    TKM[bullet] = new Bullet(Data[bullet]);
  }
  for (let key in TKM) {
    if (TKM[key].type !== '366') {
      visibilityArr.push(1);
    } else {
      visibilityArr.push(0);
    }
  }

  const hidElem = document.createElement('style');
  hidElem.innerHTML = '.hidden { display:none }';
  hidElem.id = 'lanstyle';
  document.head.appendChild(hidElem);

  document.getElementById('spreadChart').style.display = 'none';
  document.getElementById('tabs').addEventListener('click', e => tabChange(e.target.id));
  setActive('drop');

  initData(TKM);
  tableGenerate(TKM);
  drop();
  updateVisibility();
  priceUpdate();

  document.getElementById('l96').addEventListener('click', e => show96(e.target));
  document.getElementById('discobox').addEventListener('change', e => priceUpdate());
  document.getElementById('temp').addEventListener('change', e => priceUpdate());
  document.getElementById('techcrim').addEventListener('change', e => priceUpdate());
  document.getElementById('discount').addEventListener('change', e => priceUpdate());

}
