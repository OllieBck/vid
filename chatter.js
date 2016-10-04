var socket = io.connect();

socket.on('remove', function(idt){
    var parentElem = document.getElementById('chatters');
    var remove = document.getElementById(idt);
    var removeClient = parentElem.removeChild(remove);
    
});

socket.on('image', function(data, id, clients){
    var ident = "/#"+id
    for (var i = 0; i<clients.length; i++){
        if(clients[i] == ident){
        var img = new ImageConstructor(data, ident);
        }
        else{
            continue;
        }
    }
});

function ImageConstructor(source, elemId, id){
    this.img = new Image();
    this.source=source;
    this.img.src = source;
    this.elemId = elemId;
    this.img.onload = function() {
        if(document.getElementById(elemId) == null){
        placeImage();
        }
        show();
    }
    function show(){
        document.getElementById(elemId).src = source;
    }
    function placeImage() {
        /*
        this.canElem = document.createElement("canvas");
        this.canElem.id = elemId;
        document.getElementById("chatters").appendChild(this.canElem);
        this.canvas = document.getElementById(elemId);
        this.context = this.canvas.getContext('2d');
        */
        this.imgElem = document.createElement("img");
        this.imgElem.id = elemId;
        document.getElementById("chatters").appendChild(this.imgElem);
    }
}


window.addEventListener('load', start);