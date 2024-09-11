var Screen = {
	canvas: window.document.getElementById("main_screen"),
	background: new Image(),
	widthProportion: 16,
	heightProportion: 9,
	baseWidth: 1920,
	width: window.innerWidth,
	height: window.innerHeight,
	styleWidth: NaN,
	styleHeight: NaN,
	changeCanvasSize: function(){
		var width, height;
		Screen.width = window.innerWidth;
		Screen.height = window.innerHeight;
		Screen.canvas.width = 1920;
		Screen.canvas.height = 1080;
		if(Screen.width/Screen.widthProportion > Screen.height/Screen.heightProportion){
			Screen.styleWidth = (Screen.height/Screen.heightProportion) * Screen.widthProportion;
			Screen.styleHeight = (Screen.height/Screen.heightProportion) * Screen.heightProportion
            Screen.canvas.style.width = Screen.styleWidth + "px";
            Screen.canvas.style.height = Screen.styleHeight + "px";
        }else{
        	Screen.styleHeight = (Screen.width/Screen.widthProportion) * Screen.heightProportion;
        	Screen.styleWidth = (Screen.width/Screen.widthProportion) * Screen.widthProportion;
            Screen.canvas.style.height = Screen.styleHeight + "px";
            Screen.canvas.style.width = Screen.styleWidth + "px";
        }
		Screen.canvas.style.marginRight = (Screen.width - Screen.styleWidth) / 2 + "px"; 
		Screen.canvas.style.marginLeft = (Screen.width - Screen.styleWidth) / 2 + "px";
		Screen.canvas.style.marginBottom = (Screen.height - Screen.styleHeight) / 2 - 5 + "px"
		Screen.canvas.style.marginTop = (Screen.height - Screen.styleHeight) / 2 + "px";
	},

	getCanvasCoords: function(event){
		let canvasX, canvasY;
		canvasX = event.x - Screen.canvas.offsetLeft;
		canvasY = event.y - Screen.canvas.offsetTop;
		canvasX = (canvasX / Screen.styleWidth) * Screen.canvas.width;
		canvasY = (canvasY / Screen.styleHeight) * Screen.canvas.height;
		event.x = canvasX;
		event.y = canvasY;
		return {
			x: canvasX,
			y: canvasY
		}
	}
}