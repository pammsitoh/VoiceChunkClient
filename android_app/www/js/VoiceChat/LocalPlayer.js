class LocalPlayer {
    constructor(gamertag, peer_id){
        this.gamertag = gamertag;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.dimension = "OVERWORLD";
        this.peer_id = peer_id;
        this.deafen = false;
    }

    /**
     * 
     * @returns {String}
     */
    getGamertag(){
        return this.gamertag;
    }

    getPosition(){
        return this.position;
    }

    /**
     * 
     * @returns {String}
     */
    getDimension(){
        return this.dimension;
    }

    /**
     * 
     * @returns {String}
     */
    getPeerId(){
        return this.peer_id;
    }

    /**
     * 
     * @param {String} gamertag 
     */
    setGamertag(gamertag){
        this.gamertag = gamertag;
    }

    toggleDeaf(){
        this.deafen = !this.deafen;
    }

    /**
     * 
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setPosition(x,y,z){
        this.position = {
            x: x,
            y: y,
            z: z
        }
    }

    /**
     * 
     * @param {String} dimension 
     */
    setDimension(dimension){
        this.dimension = dimension;
    }

    /**
     * 
     * @param {String} peer_id 
     */
    setPeerId(peer_id){
        this.peer_id = peer_id;
    }
}