var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://54.86.100.8')

client.on('connect', function () {
  client.subscribe('doan_huy/smarthome', function (err) {
    if (!err) {
      client.publish('doan_huy/smarthome', 'Hello mqtt')
    }
  })
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log('mqtt response from mqtt://test.mosquitto.org');
  console.log(message.toString())
  //client.end()
})
