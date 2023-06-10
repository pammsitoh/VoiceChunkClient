class VoiceClient {
    constructor(peer_id,gamertag){
        this.peer_id = peer_id;
        this.gamertag = gamertag;

        //states
        this.Talking = false;
        this.Hearing = false;
        this.Muted = false;

        this.Position = {
            x: 0,
            y: 0,
            z: 0
        };

        this.current_calls = new Set();
    }

    getPeerId(){
        return this.peer_id;
    }

    getGamertag(){
        return this.gamertag;
    }
    
    getPosition(){
        return this.Position;
    }

    isTalking(){
        return this.Talking;
    }

    isHearing(){
        return this.Hearing;
    }

    isMuted(){
        return this.Muted;
    }

    setPosition(x,y,z){
        this.Position.x = x;
        this.Position.y = y;
        this.Position.z = z;
    }

    //IMPORTANT:
    Talk(Stream, Range){
        //Code for send client audio to everyone...
    }

    Hear(Range){
        if(!this.isHearing()){
            //Code for hear everyone...
        }else {
            //Code for mute everyone...
        }
    }

    EnterToServer(){
        socket.emit('enter_request',{
            gamertag: this.gamertag,
            peer_id: this.peer_id
        });
    }

    CallNearbyPlayers() {
        // Obtener los jugadores cercanos
        const nearbyPlayers = _vc_server_data.filter(obj => this.isPeerNearby(obj.peer_id));
        console.log(nearbyPlayers);

        // Array.from(this.current_calls).forEach(peerId => {
        //     console.log("Calling...");
        //     if (!nearbyPlayers.some(player => player.peer_id === peerId)) {
        //         // El jugador ya no está cerca, cerrar la llamada
        //         peer.close(peerId);
        //         this.current_calls.delete(peerId);
        //     }
        // });

        // Llamar a los jugadores cercanos
        nearbyPlayers.forEach(player => {
            if(player.peer_id != "NAN"){
                if (!this.current_calls.has(player.peer_id)) {
                    navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        // Aquí tienes acceso al stream de audio del micrófono
                        // Puedes utilizar el stream para reproducir, grabar, procesar...
                        console.log("Calling..." + this.isPeerNearby(player.peer_id));
                        peer.call(player.peer_id,stream);
                    })
                    .catch(error => {
                        console.error("Error al acceder al micrófono:", error);
                    });
                    this.current_calls.add(player.peer_id);
                }
            }
        });
    }


    isPeerNearby(peer_id) {
        const range = 16; // Rango de unidades permitido

        const is_nearby = _vc_server_data.some(obj => {
            if (obj.peer_id === peer_id) {

                const distance = Math.sqrt(
                    Math.pow(obj.position[0] - this.Position.x, 2) +
                    Math.pow(obj.position[1] - this.Position.y, 2) +
                    Math.pow(obj.position[2] - this.Position.z, 2)
                );

                // Verificar si la distancia está dentro del rango permitido
                return distance <= range;
            }
            return false; // Si no coincide la peer_id, retorna false
        });

        return is_nearby;
    }

}