// reference: // from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// referecne: http://stackoverflow.com/questions/9088552/javascript-custom-object-and-image-onload

var socket = io.connect();

socket.on('connect', function(){
    console.log("Connected");
    socket.emit('start');
});
    
    function invert(data, ctx, imageData){
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];// red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
    }

    function impress(data, ctx, imageData){
        for (var i = 0; i < data.length; i += 16){
             var x = (i / 4) % 320;
             var y = Math.floor((i / 4) / 320);
             var darkness = (255 - data[i*4]) / 255; 
             var radius = 16 * darkness;
             ctx.beginPath();
             ctx.lineWidth="10";
             ctx.rect(x, y, radius, radius);
             ctx.stroke();
        }
    ctx.putImageData(imageData, 0, 0);
}


socket.on('launch', function(){
    window.open("https://job271.itp.io:8082/chat.html", "", "width=350. height=450"); 
});


function init(){

// These help with cross-browser functionality (shim)
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||             navigator.msGetUserMedia;

    // The video element on the page to display the webcam
    var video = document.getElementById('thevideo');

    // if we have the method
    if (navigator.getUserMedia) {
	   navigator.getUserMedia({video: true}, function(stream) {
			 video.src = window.URL.createObjectURL(stream) || stream;
			 video.play();
		  }, function(error) {alert("Failure " + error.code);});
    }
    
    var draw = function() {
        var thecanvas = document.getElementById('thecanvas');
        var thecontext = thecanvas.getContext('2d');
        // Draw the video onto the canvas
	    thecontext.drawImage(video,0,0,video.width,video.height);
    
        //added
        var imageData = thecontext.getImageData(0, 0, thecanvas.width, thecanvas.height);
        var data = imageData.data;
        
        invert(data, thecontext, imageData);

	    var dataUrl = thecanvas.toDataURL('image/webp', 1);
        
        // Optionally draw it to an image object to make sure it works
         document.getElementById('imagefile').src = dataUrl;
	   
        
        // Send it via our socket server the same way as we send the image
        socket.emit('image', dataUrl, socket.id);
	   
        // Draw again in 3 seconds
	   setTimeout(draw,300);	
    };
    draw();
};

window.addEventListener('load', init);