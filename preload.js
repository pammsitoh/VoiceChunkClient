const { ipcRenderer, contextBridge, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('api',{
    joinRoom: (GamertagSelected) => {
        ipcRenderer.send('joinRoom', {
            gamertag: GamertagSelected
        });
    },
    ReceiveRoom: (callback) => {
        ipcRenderer.on("verify", (event, data) => {
            callback(data);
        });
    },
    onMuteShortcut: (callback) => {
        ipcRenderer.on("NewMuteShortcut", (event, data) => {
            callback(data);
        });
    },
    onDeafShortcut: (callback) => {
        ipcRenderer.on("NewDeafShortcut", (event, data) => {
            callback(data);
        });
    },
    queryMuteShortcut: () => {
        let display = document.querySelector("#mute-shortcut-selected");

        display.className = "shadow-md text-white bg-red-500 border border-red-900 p-2 w-10 flex justify-center"

        function handleKey(event){
            ipcRenderer.send("QueryMuteShortcut",{
                key: event.key
            });

            document.removeEventListener('keydown', handleKey);
        }

        document.addEventListener('keydown', handleKey);
    },
    queryDeafShortcut: () => {
        ipcRenderer.sendt("QueryDeafShortcut",{});
    }
});