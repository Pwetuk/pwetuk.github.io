class Enemy1 extends Enemy{
	static lastspawned = 0;
	
	constructor(posX, posY, getPlayerPos){
		super(posX, posY, 4);
		this.color = "rgb(0, 255, 255)";
		this.origColor = this.color;
		this.getPlayerPos = getPlayerPos;
		this.health = 200;
		this.texture = new Image();
		this.revtexture = new Image();
		this.texture.src = "https://lazyevaluation.ru/dominator/enemy1.png";
		this.revtexture.src = "https://lazyevaluation.ru/dominator/revenemy1.png";
		this.textureX = 64;
		this.textureY = 64;
		this.textureW = 32;
		this.textureH = 30;
		this.frames = 1;
	}
}