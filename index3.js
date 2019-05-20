var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
var serialPort = new SerialPort("COM6", { baudRate: 115200 });
const parser = serialPort.pipe(new Readline());

var SerialPort2 = require("serialport");
const Readline2 = require('@serialport/parser-readline');
var serialPort2 = new SerialPort2("COM4", {baudRate: 115200});
const parser2 = serialPort2.pipe(new Readline2());

var moment = require('moment')

var PublishMessageTopic = {
    "Room": '1',
    "Data":{
        "Lamp" : '1',
        "Value": '1'
    }
};

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://huysmarthome.tk');
var topicsb = 'doan_huy/smarthome/control';
var topicpb = 'doan_huy/smarthome/update';
client.on('connect', function () {
    console.log("Connected Broker");
    client.subscribe(topicsb, function (err) {
        console.log(err);
    });
});

client.on('message', function (topic, message) {
  // Tin nhắn nhận được ở dạng Buffer nên chuyển qua String sau đó convert về Json
  var msg  = JSON.parse(message.toString());
  console.log(msg);
  UpdateLamp(msg);
  if(msg.Room == 1 )
  {
    console.log(msg.Room  + '-den' + msg.Data.Lamp + '-' +msg.Data.Value);
    serialPort.write(msg.Room  + '-den' + msg.Data.Lamp + '-' +msg.Data.Value);
    serialPort.write("\r\n")
  }
  if((msg.Room == 2) && (msg.Data.Lamp < 5))
  {
    console.log(msg.Room  + '-den' + msg.Data.Lamp + '-' +msg.Data.Value);
    serialPort2.write(msg.Room  + '-den' + msg.Data.Lamp + '-' +msg.Data.Value);
    serialPort2.write("\r\n")
  }

  if((msg.Room == 2) && (msg.Data.Lamp == 5))
  {
      var settimeon = setInterval(function(){
      console.log("setdata timeon");
      var timecurrent = moment().format('hh:mm A')
      console.log('time current: '+ timecurrent);
      var time = moment(msg.Data.Timeon).utc().format('hh:mm A')
      console.log('time set on: ' + time);
      if(timecurrent == time)
      {
        console.log('1-den5-1');
        serialPort2.write('1-den5-1')
        serialPort2.write("\r\n")
        clearInterval(settimeon);
      }
    }, 30000);

      var settimeoff = setInterval(function(){
      console.log("setdata timeoff");
      var timecurrent = moment().format('hh:mm A')
      console.log('time current: '+ timecurrent);
      var timeoff = moment(msg.Data.Timeoff).utc().format('hh:mm A')
      console.log('time set off: ' + timeoff);
      if(timecurrent == timeoff)
      {
        console.log('1-den5-0');
        serialPort2.write('1-den5-0')
        serialPort2.write("\r\n")
        clearInterval(settimeoff);
      }
    }, 30000);
  }
});

function UpdateLamp(message){
    var Type = message.Type;
    var Room = message.Room;
    var Data = message.Data;
    var Lamp = Data.Lamp;
    var Value = Data.Value;
    var PublishMessage = {
        "Room": Room,
        "Data":{
            "Lamp" : Lamp,
            "Value": Value
        }
    };
    // Nhớ Stringify dữ liệu không gửi lên bị lỗi
    client.publish(topicpb, JSON.stringify(PublishMessage));
}
serialPort.on('open',onOpen);
parser.on('data',onData);
function onOpen(){
  console.log("Open connected serialport");
}
function onData(data){
  console.log("My data: "+ data);
  const __data = String(data);
  //if(String.fromCharCode(data[0]) == )
  PublishMessageTopic.Room = '1';
  PublishMessageTopic.Data.Lamp = __data[5];
  PublishMessageTopic.Data.Value = __data[7];
  if((__data.length > 7) &&  (__data[8] != ('\r')) )
  {
    PublishMessageTopic.Data.Value = __data[7]+__data[8];
  }
  console.log('PublishMessageTopic data: '+ JSON.stringify(PublishMessageTopic));
  client.publish(topicpb, JSON.stringify(PublishMessageTopic));
}
////////////////////////////////////////////////////////////
serialPort2.on('open',onOpen2);
parser2.on('data',onData2);
function onOpen2(){
  console.log("Open connected serialport2");
}
function onData2(data){
 console.log("My data2: "+ data);
 const __data = String(data);
 //if(String.fromCharCode(data[0]) == )
 PublishMessageTopic.Room = '2';
 PublishMessageTopic.Data.Lamp = __data[5];
 PublishMessageTopic.Data.Value = __data[7];
 if((__data.length > 7) &&  (__data[8] != ('\r')) )
 {
   PublishMessageTopic.Data.Value = __data[7]+__data[8];
 }
 console.log('PublishMessageTopic data: '+ JSON.stringify(PublishMessageTopic));
 client.publish(topicpb, JSON.stringify(PublishMessageTopic));
}
/////////////////////////////////////////////////////////////
function timestampToTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", {hour: 'numeric', minute:'numeric'});
}
