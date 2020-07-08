console.log("main process started");

//necessary moduls
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");

const ipc  = electron.ipcMain; 
//main codes//

let win, winSlide; //window variables

function createWindow(){
    win = new BrowserWindow({
        webPreferences: {nodeIntegration: true}
    });
    
    win.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file', //cause: we are serving file from filesystem not http
        slashes: true
    }));
    win.setMenu(null);
    win.webContents.openDevTools(); 
    win.on('closed', ()=>{win=null;}) // giving ability to close window
}

ipc.on('ondragstart', (event, filePath) => {
    readFile(filePath)
    function readFile(){
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if(err)
            {
                alert("errmsg:",err.message)
            }
            else{
                event.sender.send('fileData',data)
            }
        })

    }
  })

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
});
//for mac
app.on('activate', () => {
    if (win === null){
        createWindow()
    }
});

// inter process communication
var sliderData;
ipc.on('open-slide-window',function(event,DATA){
    console.log("EVENT: open-slide-window",DATA.length,DATA[2]);
    //sliderData = [imgList,timeinterval,CheckWindowOnTop];
    sliderData = DATA;
    winSlide = new BrowserWindow({
        height:700,
        width:600,
        transparent: true,
        frame:false,
        webPreferences: {nodeIntegration: true}
    });
    winSlide.loadURL(url.format({
    pathname: path.join(__dirname,'slider.html'),
    protocol: 'file',
    slashes: true,
  }));
  //winSlide.webContents.openDevTools(); 
  winSlide.setMenu(null);
  winSlide.setAlwaysOnTop(DATA[2],'screen');
  winSlide.show();
  
});

ipc.on("ask-slider-data",function(event){
    console.log("EVENT: ask-slider-data");
    event.sender.send("send-slider-data",sliderData);
});

ipc.on("slider-close-req",function(event){
    console.log("EVENT: slider-close-req");
    winSlide.webContents.send('slider-close-process');
})
