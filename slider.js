console.log('slider.js process');

const remote = require('electron').remote;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;

var time = 1000;
var startPointer = 0;

function changeImg(getImg){
  console.log("in ops",startPointer);
  document.getElementById('slide').src = getImg[startPointer];

  if(startPointer<getImg.length-1)
  {startPointer++;}
  else
  {startPointer = 0;}

  setTimeout("changeImg(imgList)",time);  
};


// inter process communication
ipc.send("ask-slider-data");

var imgList;
ipc.on('send-slider-data',function(event,sliderData){
    console.log("EVENT: send-image-data",sliderData.length);
    //sliderData = [imgList,timeinterval,CheckWindowOnTop];
    imgList = sliderData[0];
    time = sliderData[1]*1000;
    changeImg(imgList);
});

ipc.on('slider-close-process',function(event){
  var tempWindow = remote.getCurrentWindow();
  tempWindow.close();
})