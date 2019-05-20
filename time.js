var moment = require('moment')
var timestamp = 6504
var time = moment(timestamp).utc().format('hh:mm A')
console.log(time);
