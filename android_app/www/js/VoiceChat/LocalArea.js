class LocalArea {
    constructor(player){
        this.player = player;
        this.range = 32;

        this.playersInside = [];
    }

    getPlayer(){
        return this.player;
    }

    getRange(){
        return this.range;
    }

    getPlayers(){
        return this.playersInside;
    }

    /**
     * 
     * @param {String} name 
     */
    removePlayerByName(name){
        let index = this.playersInside.findIndex(player => player.gamertag === name);
        if(index != -1){
            this.playersInside.splice(index,1);
        }
    }

    on(event_name, callback){
        if(event_name == 'PlayerJoin'){
            //console.log('event playerjoin running?...');
            usable.VoiceServerData.getPlayersInRoom().forEach( player => {
                //verify...
                if( player.gamertag != this.getPlayer().gamertag ){
                    if(!this.playersInside.some(pl => pl.gamertag === player.gamertag)){
                        let distance = Math.sqrt(
                            Math.pow(player.position.x - this.player.position.x, 2) +
                            Math.pow(player.position.y - this.player.position.y, 2) +
                            Math.pow(player.position.z - this.player.position.z, 2)
                        );
        
                        if(distance <= this.range){
                            //verificar si ya estaba en rango...
                            this.playersInside.push(player);
                            callback(player);
                        }
                    }
                }
            })
        }else if(event_name == 'PlayerLeave'){
            //console.log('event playerleave running?...');
            this.playersInside.forEach( (player, index) => {
                
                usable.VoiceServerData.getPlayersInRoom().forEach( vPlayer => {
                    if(player.gamertag == vPlayer.gamertag){
                        let distance = Math.sqrt(
                            Math.pow(vPlayer.position.x - this.player.position.x, 2) +
                            Math.pow(vPlayer.position.y - this.player.position.y, 2) +
                            Math.pow(vPlayer.position.z - this.player.position.z, 2)
                        );

                        let audiio = document.getElementById(vPlayer.peerId);

                        if(audiio){
                            if (distance <= 16) {
                                let volume = 100 - ((distance / 16) * 100);
                                // Asignar el volumen interpolado a la etiqueta de audio con ID "peer.id"
                                audiio.volume = volume / 100;
                            }else {
                                // Si la distancia es mayor a 16, establecer el volumen en 0
                                audiio.volume = 0;
                            }    
                        }

                        if(distance >= this.range){
                            this.playersInside.splice(index, 1);
                            callback(player);
                        }
                    }
                });

            })
        }
    }
}