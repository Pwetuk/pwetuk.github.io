class AudioPlayer{
	static {
		this.musicVol = 1;
		this.effectsVol = 1;
		this.music = new Audio("https://lazyevaluation.ru/dominator/music.ogg");
		this.effects = [new Audio("https://lazyevaluation.ru/dominator/playerhit.wav"), new Audio("https://lazyevaluation.ru/dominator/enemyhit.wav"), new Audio("https://lazyevaluation.ru/dominator/death.wav")];
	}

	static playMusic(){
		this.music.play();
		this.music.loop = true;
	}

	static setMusicVol(volume){
		this.musicVol = volume;
		this.music.volume = this.musicVol;
	}

	static getMusicVol(){
		return this.musicVol;
	}

	static setEffectsVol(volume){
		this.effectsVol = volume;
		this.effects.forEach((obj) => {obj.volume = this.effectsVol;});
	}

	static getEffectsVol(){
		return this.effectsVol;
	}
}