//
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require("electron").ipcRenderer
//button and box const
const newWindowBtn = document.getElementById('newWindowBtn');
const closeSlideBtn = document.getElementById('closeSlideBtn');
const secondsBox = document.getElementById('secondsBox');




console.log("index.js process");
var imgList = [];
var time = 1000;
var startPointer = 0;

function changeImg(getImg){
  console.log("in ops",getImg.length,startPointer);

  if(startPointer<getImg.length){
    document.getElementById('slide').src = getImg[startPointer];
    startPointer++;
      }
      else{
          startPointer = 0;
      }
      setTimeout("changeImg(imgList)",time);  
};

(function() {
  var dropzone = document.getElementById('dropzone');

  dropzone.ondrop = function (e) {
    e.preventDefault();
    this.className = "dropzone";
    
    //console.log(e.dataTransfer.files)
    files = e.dataTransfer.files;
    if (files) {
      for (var i=0, f; f=files[i]; i++) {
          var r = new FileReader();
          r.onload = (function(f) {
            return function(e) {
              var contents = e.target.result;
              imgList.push(contents);
              console.log(imgList.length);
              var addr = 'res/img1.jpg';
              document.getElementById("gallary").innerHTML += `
              <div class='card text-white bg-primary mb-1 mr-1' style='max-width: 18rem;'>
                  <img height=100 width=100  src='`+imgList[imgList.length-1]+`'>
            </div>
          `
            ;
            
          
          };
      })(f);

    r.readAsDataURL(f);
    //changeImg(imgList);
}   
} else {
  alert("Failed to load files"); 
}
   

  };

  dropzone.ondragover = function() {
    this.className = 'dropzone dragover';
    return false;
  };
  dropzone.ondragleave = function(){
    this.className = 'dropzone';
    return false;
  };
}());

// inter process communication
newWindowBtn.addEventListener('click', function(){
  // get var data
  var timeinterval = document.getElementById('secondsBox').value
  var CheckWindowOnTop = document.getElementById('CheckWindowOnTop').checked
  var sliderData = [imgList,timeinterval,CheckWindowOnTop];
  
  //send var data and do operation
  ipc.send('open-slide-window',sliderData);
  document.getElementById('CheckWindowOnTop').disabled = true;
  newWindowBtn.disabled= true;
  closeSlideBtn.style.visibility = "visible";
  secondsBox.disabled = true;
  // let winSlide = new BrowserWindow({height:400,width:600});
  // winSlide.loadURL(url.format({
  //   pathname: path.join(__dirname,'slider.html'),
  //   protocol: 'file',
  //   slashes: true
  // }))
  // winSlide.setMenu(null)

});
closeSlideBtn.addEventListener('click',function(){
  document.getElementById('CheckWindowOnTop').disabled = false;
  closeSlideBtn.style.visibility = "hidden";
  newWindowBtn.disabled= false;
  secondsBox.disabled = false;
  
  ipc.send('slider-close-req');
});