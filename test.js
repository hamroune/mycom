var crossfilter = require('crossfilter');


var data = [
/*
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}*/
  {date: "2011-11-14T17:29:52Z", "continent" :"europe", "country":"france", "style": "modern", quantity: 1, total: 200}
  ,{date: "2011-11-14T17:29:52Z", "continent" :"europe", "country":"italy", "style": "classic", quantity: 2, total: 250}
  ,{date: "2011-11-14T17:29:52Z", "continent" :"europe", "country":"spain", "style": "neo", quantity: 2, total: 350}
  ,{date: "2011-11-14T17:29:52Z", "continent" :"europe", "country":"germany", "style": "modern", quantity: 3, total: 400}
  ,{date: "2011-11-14T17:29:52Z", "continent" :"asia", "country":"japan", "style": "classic", quantity: 3, total: 600}
  ,{date: "2011-11-14T17:29:52Z", "continent" :"asia", "country":"china", "style": "neo", quantity: 1, total: 120}
  
];

/*
for (var i =0; i< 1000000; i++){
  var currentDate = new Date().toString("yyyy-MM-dd hh:mm:SSS");

  var qt = parseInt(Math.random()*10*2, 10);
  var total = Math.random()*10*300;
  var type = (parseInt(total, 10) %3 === 0)? "visa": (parseInt(total, 10) %3 === 0)? "tab" : "cash";

  var obj = {date: currentDate, quantity: qt, total: total, type: type}
  data.push(obj);
}
*/


var payments = crossfilter(data);


var size = payments.size();
console.log('Size', size)


var paymentsByType = payments.dimension(function(d) { return d.country; }),
    paymentVolumeByType = paymentsByType.group().reduceSum(function(d) { return d.total; }),
    topTypes = paymentVolumeByType.top(1);
var topKey = topTypes[0].key; // the top payment type (e.g., "tab")
var topVal =topTypes[0].value; // the payment volume for that type (e.g., 900)



function reduceAdd(p, v) {
  ++p.count;
  p.total += v.total;
  return p;
}

function reduceRemove(p, v) {
  --p.count;
  p.total -= v.total;
  return p;
}

function reduceInitial() {
  return {count: 0, total: 0};
}

function orderValue(p) {
  return p.total;
}

var topTotals = paymentVolumeByType.reduce(reduceAdd, reduceRemove, reduceInitial).order(orderValue).top(2);
var key = topTypes[0].key;   // payment type with highest total (e.g., "tab")
var val = topTypes[0].value; // reduced value for that type (e.g., {count:8, total:920})
console.log('======================= '+key+' ================= ', '\n ======================= '+JSON.stringify(val)+' ================= ');

var paymentVolumeByTypeRecords = paymentVolumeByType.all();
console.log('paymentVolumeByTypeRecords: \n', paymentVolumeByTypeRecords);