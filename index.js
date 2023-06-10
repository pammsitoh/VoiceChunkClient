const { app, BrowserWindow, systemPreferences, ipcMain, ipcRenderer, contextBridge, globalShortcut } = require('electron')
const path = require('path');
const http = require('http');

//console.log(systemPreferences.getMediaAccessStatus('microphone'));

function createWindow () {
  // Crea la ventana del navegador.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    maxHeight: 600,
    maxWidth: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false
    }
  })

  // Carga la página index.html de la aplicación.
  win.loadFile('views/index.html')
  win.setMenu(null);
  win.setIcon(path.join(__dirname, 'logo.png'));
  //win.webContents.openDevTools();
}

ipcMain.on('joinRoom', (event, data) => {

  const dot = {
    "name": data.gamertag,
    "verified": false
  };

  const postData = JSON.stringify(dot);

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/check',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', data => {
      const bull = JSON.parse(data.toString());
      console.log(bull);

      dot.verified = bull;

      event.reply("verify", dot);
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.write(postData);
  req.end();

});

let isListening = false;

ipcMain.on('QueryMuteShortcut', (event,data) => {
  console.log(`New Shortcut:${data.key}`);
  event.sender.send("NewMuteShortcut", data);
});

// Este método se llama cuando Electron ha terminado de inicializarse
// y está listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow()
})

// Salga cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explícitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // dock icon es clicado y no hay otras ventanas abiertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


