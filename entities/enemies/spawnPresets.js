function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


class SpawnPresets{
	static enemies = 1;
	static lastSpawned = 0;
	static resetCounter(){
		this.enemies = 0;
	} 

	static defaultSpawn(gameTime, enemiesCount, enemiesType, spawnCooldown, enemiesCountRiseCoef){
		if(gameTime - this.lastSpawned > spawnCooldown * 1000 && Enemy.count < 50){
			for(var i=0;i<=this.enemies;i++){
				var enemy = Enemy.randomSpawn(enemiesType);
				Game.objects.add(enemy);
			}
			this.enemies *= enemiesCountRiseCoef;
			this.lastSpawned = gameTime;
		}
	}

	static stage1(gameTime, enemiesCount){
		this.defaultSpawn(gameTime, enemiesCount, Enemy1, 1, 1.1);
	}

	static stage2(gameTime, enemiesCount){
		this.defaultSpawn(gameTime, enemiesCount, Enemy2, 2, 1.2);
	}
}
