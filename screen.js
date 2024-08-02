var Screen = {
	canvas: window.document.getElementById("main_screen"),
	background: new Image(),
	widthProportion: 16,
	heightProportion: 9,
	baseWidth: 1920,
	width: window.innerWidth,
	height: window.innerHeight,
	sizeCoef: 1,
	changeCanvasSize: function(){
		Screen.width = window.innerWidth;
		Screen.height = window.innerHeight;
		if(Screen.width/Screen.widthProportion > Screen.height/Screen.heightProportion){
			Screen.canvas.width = (Screen.height/Screen.heightProportion) * Screen.widthProportion;
			Screen.canvas.height = (Screen.height/Screen.heightProportion) * Screen.heightProportion
		}else{
			Screen.canvas.height = (Screen.width/Screen.widthProportion) * Screen.heightProportion;
			Screen.canvas.width = (Screen.width/Screen.widthProportion) * Screen.widthProportion;
		}
		Screen.canvas.style.marginRight = (Screen.width - Screen.canvas.width) / 2 + "px"; 
		Screen.canvas.style.marginLeft = (Screen.width - Screen.canvas.width) / 2 + "px";
		Screen.canvas.style.marginBottom = (Screen.height - Screen.canvas.height) / 2 - 5 + "px"
		Screen.canvas.style.marginTop = (Screen.height - Screen.canvas.height) / 2 + "px";
		Screen.sizeCoef = Screen.canvas.width / Screen.baseWidth;
	}
}