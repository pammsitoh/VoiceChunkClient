let mic_muted = false;

const MediaDeviceStart = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
    const audioOptions = document.querySelector('#audio-devices');
    devices.forEach(function(device) {
        if (device.kind === 'audioinput') {
        console.log(device.label + ' (id=' + device.deviceId + ')');
        const newDevice = document.createElement('option');
        newDevice.value = device.deviceId;
        newDevice.innerHTML = device.label;

        audioOptions.appendChild(newDevice);
        }
    });
    })
    .catch(function(err) {
    console.log(err.name + ": " + err.message);
    })

    const select = document.querySelector('#audio-devices');

    select.addEventListener('change', function() {
        //console.log('Seleccionado: ' + select.value);
        usable.LocalStream.setDeviceId(select.value);
    });
}

const SetLocalStream = () => {
    navigator.mediaDevices.getUserMedia({audio:{deviceId: { exact: usable.LocalStream.getDeviceId() }}})
    .then( stream => {
        usable.LocalStream.setStream(stream);
    });
}

function voiceDetector() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyserNode = audioContext.createAnalyser();

  let talking = false; // variable de estado para indicar si el estado de "hablando" ha cambiado

  navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: usable.LocalStream.getDeviceId() } }})
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyserNode);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const visualizerElement = document.getElementById('visualizer');
    const visualizerContainer = visualizerElement.parentNode;

    const detectVoice = () => {
      analyserNode.getByteFrequencyData(dataArray);
      const voiceActivity = dataArray.slice(85, 255).reduce((a, b) => a + b, 0) / 170;
      const isTalkingNow = voiceActivity > 0.1; // umbral del 50%
      visualizerElement.style.width = `${voiceActivity/50 * 100}%`;

      // Limitar el ancho máximo del visualizerElement al ancho del contenedor padre
      const containerWidth = visualizerContainer.clientWidth - 10;
      const maxWidth = containerWidth + 'px';
      visualizerElement.style.maxWidth = maxWidth;

      if (isTalkingNow && !talking) {
        talking = true;
        //code...
        socket.emit('voice_activity', {
          gamertag: usable.LocalPlayer.gamertag,
          talking: true,
          muted: mic_muted,
          deafen: usable.LocalPlayer.deafen
        });
      } else if (!isTalkingNow && talking) {
        talking = false;
        //code...
        socket.emit('voice_activity', {
          gamertag: usable.LocalPlayer.gamertag,
          talking: false,
          muted: mic_muted,
          deafen: usable.LocalPlayer.deafen
        });
      }

      requestAnimationFrame(detectVoice);
    };

    detectVoice();
  })
  .catch(error => {
    console.error(error);
  });
}

const ToggleStream = () => {
    usable.LocalStream.getStream().getAudioTracks().forEach(track => track.enabled = !track.enabled);
    usable.LocalStream.toggleMuted();
    let btn = document.querySelector('#mute-button');
    let snd = document.querySelector('#snd-btn');
    let visual = document.querySelector('#visualizer');
    if(usable.LocalStream.isMuted()){
        btn.className = "bg-red-500 p-4 border border-red-900 rounded-md font-semibold shadow-md text-white"
        btn.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`
        snd.pause();
        snd.currentTime = 0;
        snd.playbackRate = 0.3;
        snd.play();
        visual.className = "w-full h-4 rounded-sm bg-gradient-to-r from-red-200 via-red-500 to-orange-200 bg-fixed"
        mic_muted = true;
    }else {
        btn.className = "bg-blue-500 p-4 border border-blue-900 rounded-md font-semibold shadow-md text-white"
        btn.innerHTML = `<i class="fa-solid fa-microphone"></i>`
        snd.pause();
        snd.currentTime = 0;
        snd.playbackRate = 1;
        snd.play();
        visual.className = "w-full h-4 rounded-sm bg-gradient-to-r from-lime-200 via-lime-500 to-red-200 bg-fixed"
        mic_muted = false;
    }
}

const ToggleDeaf = () => {
  usable.LocalPlayer.toggleDeaf();
  let btn = document.querySelector("#deafen-button");
  let snd = document.querySelector('#snd-btn');
  let auds = document.querySelectorAll("audio:not(.snd-btn)");
  if( usable.LocalPlayer.deafen ){
    btn.className = "bg-red-500 p-4 border border-red-900 rounded-md font-semibold shadow-md text-white"
    snd.pause();
    snd.currentTime = 0;
    snd.playbackRate = 0.3;
    snd.play();
    for (var i = 0; i < auds.length; i++) {
      auds[i].volume = 0; // establece el volumen en el 0%
    }
  }else {
    btn.className = "bg-blue-500 p-4 border border-blue-900 rounded-md font-semibold shadow-md text-white"
    snd.pause();
    snd.currentTime = 0;
    snd.playbackRate = 1;
    snd.play();
    for (var i = 0; i < auds.length; i++) {
      auds[i].volume = 1; // establece el volumen en el 100%
    }
  }
  ToggleStream();
}

function leaveRoom(){
    location.reload();
}