class VoiceServerData {
    constructor(){
        this.players = [];
        this.playersInRoom = [];
        this.calls = [];
    }

    getPlayers(){
        return this.players;
    }

    setPlayers(players){
        this.players = players;
    }

    getPlayersInRoom(){
        return this.playersInRoom;
    }

    setPlayersInRoom(players){
        this.playersInRoom = players;
    }

    getAllCalls(){
        return this.calls;
    }

    getCallById(id){
        return this.calls.find(c => c.peer === id);
    }

    addCall(call){
        this.calls.push(call);
    }

    removeCall(call){
        let index = this.calls.findIndex( cl => cl.peer === call.peer );
        this.calls.splice(index, 1);
    }
}