class LocalStream{
    #stream;
    #deviceId;
    #muted;

    constructor(){
        this.#stream;
        this.#deviceId;
        this.#muted = false;
    }

    getStream(){
        return this.#stream
    }

    /**
     * @returns {string}
     */
    getDeviceId(){
        return this.#deviceId;
    }

    /**
     * 
     * @returns {boolean}
     */
    isMuted(){
        return this.#muted;
    }

    toggleMuted(){
        this.#muted = !this.#muted;
    }

    setDeviceId(id){
        this.#deviceId = id;
    }

    setStream(stream){
        this.#stream = stream;
    }
}