const Peer = window.Peer;
const socket = io.connect(`http://${window.localStorage.getItem('voice_server')}:8000`);

const qvoice_server_host = window.localStorage.getItem('voice_server');
let _vc_server_data = [];
let _my_gamertag = "";
let _peer_id;
let _callInterval;
let VcClient;
let usable = {
  LocalPlayer: null,
  LocalArea: null,
  VoiceServerData: new VoiceServerData(),
  LocalStream: new LocalStream()
}

window.api.onMuteShortcut(data => {

  let display = document.querySelector("#mute-shortcut-selected");

  display.className = "shadow-md bg-white border border-slate-300 p-2 w-10 flex justify-center"
  display.innerHTML = data.key;
});

document.getElementById("room_input").value = window.localStorage.getItem('voice_server');

MediaDeviceStart();

// Crea un objeto Peer y especifica la URL del servidor de señalización
const peer = new Peer(undefined, {
  host: window.localStorage.getItem('voice_server'),
  port: 9000, // El puerto debe coincidir con el puerto utilizado en el servidor de señalización
  path: '/vcserver' // La ruta debe coincidir con la ruta utilizada en el servidor de señalización
});

// Cuando se genera el ID del Peer
peer.on('open', (peerId) => {
  //console.log('Mi ID de Peer es: ' + peerId);
  usable.LocalPlayer = new LocalPlayer(_my_gamertag,peerId);
});

// Escuchar eventos de llamadas entrantes
peer.on('call', incomingCall => {
  incomingCall.answer();
  incomingCall.on('stream', stream => {
    const audioPlayer = document.createElement('audio');
    audioPlayer.id = incomingCall.peer;
    audioPlayer.srcObject = stream;
    audioPlayer.autoplay = true;
    audioPlayer.volume = 0;
    document.getElementById('audio-room').appendChild(audioPlayer);

    usable.VoiceServerData.addCall(incomingCall);
  });
  incomingCall.on('close',() => {
    const audioPlayer = document.getElementById(incomingCall.peer);
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.srcObject = null;
      audioPlayer.remove();
    }
    usable.VoiceServerData.removeCall(incomingCall);
  });
});

socket.on('AllPlayerData', data => {
  usable.VoiceServerData.setPlayers(data.general);
  usable.VoiceServerData.setPlayersInRoom(data.room);

  if(usable.LocalPlayer?.getGamertag() != ""){
    let updatedLocalPlayer = usable.VoiceServerData.getPlayers().find(el => el.gamertag === usable.LocalPlayer.getGamertag());

    if(updatedLocalPlayer != null){
      usable.LocalPlayer.setDimension(updatedLocalPlayer.dimension);
      usable.LocalPlayer.setPosition(updatedLocalPlayer.position.x,updatedLocalPlayer.position.y,updatedLocalPlayer.position.z);
    }else{
      location.reload();
    }
  }
});

socket.on('voice_disconnect', data => {
  usable.LocalArea.removePlayerByName(data.gamertag);
});

function joinChat(){
  //console.log("[VC] Entrando al chat...");
  usable.LocalPlayer?.setGamertag(document.getElementById("input").value);

  if( window.localStorage.getItem('voice_server') != document.getElementById("room_input").value){
    window.localStorage.setItem('voice_server', document.getElementById("room_input").value);
    location.reload();
  }

  //Verifica que el jugador este en el servidor...
  if(usable.VoiceServerData.getPlayers().some( obj => obj.gamertag === usable.LocalPlayer.getGamertag())){
    
    usable.LocalArea = new LocalArea(usable.LocalPlayer);

    socket.emit('enter_request',usable.LocalPlayer);

    SetLocalStream();
    voiceDetector();

    document.querySelector('#options').className = "hidden";
    document.querySelector('#leave').className = "block";
    
    _callInterval = setInterval(() => {

      usable.LocalArea.on('PlayerJoin', player => {
        //console.log(`${player.gamertag} ha entrado en rango -> ${player.peerId}`);
        //console.log("llamando...");
        peer.call(player.peerId, usable.LocalStream.getStream());
      });

      usable.LocalArea.on('PlayerLeave', player => {
        //console.log(`${player.gamertag} ha salido de rango`);
        let call = usable.VoiceServerData.getCallById(player.peerId);
        call.close();
      });

      // Itera sobre los jugadores en usable.LocalArea.playersInside
      for (let i = usable.LocalArea.playersInside.length - 1; i >= 0; i--) {
        const player = usable.LocalArea.playersInside[i];
        
        // Verifica si el gamertag del jugador se encuentra en usable.VoiceServerData.getPlayersInRoom()
        const isPlayerInRoom = usable.VoiceServerData.getPlayersInRoom().some(roomPlayer => roomPlayer.gamertag === player.gamertag);
        
        // Si el jugador no está en la sala, elimínalo de usable.LocalArea.playersInside
        if (!isPlayerInRoom) {
          usable.LocalArea.playersInside.splice(i, 1);
        }
      }

    },500)
  }else {
    let modal = document.querySelector("#modal_alert");
    if(modal){
      modal.innerHTML = "Ese jugador no se encuentra en el servidor...";
    }
    showModal();
  }
}

function toggleSettings(){
  let settings_modal = document.querySelector("#settings_page");
  if(settings_modal.classList.contains("hidden")){
    settings_modal.classList.remove("hidden");
  }else{
    settings_modal.classList.add("hidden");
  }
}