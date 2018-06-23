class Mess extends Phaser.Sprite {
	
    constructor(game, x, y) {
        super(game, 0, 0);
		
		let spriteSelector = Math.floor(Math.random()*4);
		
        Phaser.Sprite.call(this, game, x, y, 'sprite_bookPile_' + spriteSelector);
        
        this.anchor.setTo(0.5, 0.5);
		this.inputEnabled = true;
		this.angle = Math.floor(Math.random() * 360);
		
        game.add.existing(this);
        //game.physics.arcade.enable(this);
		
    	this.events.onInputDown.add(this.onClick, this);
		
		//Set a timer that hurts your popularity if messes are left lying on the floor for too long
		this.popularityTimer = 7;
		
    }
    
    update() {
		
		if (this.popularityTimer > 0) {
        	this.popularityTimer -= game.time.physicsElapsed;
		} else {
			this.popularityTimer = 4;
			playState.popularityDecrease(1);
		}
    }
    
	onClick() {
    	let puff = game.add.emitter(this.x, this.y, 10);
		puff.makeParticles('particle_puff');
		
		puff.setAlpha(1, 0, 250);
		puff.maxParticleSpeed = 0;
    	puff.start(true, 250, null, 3);
		
		
		game.time.events.add(75, function(){this.visible = false;}, this);
		
		game.time.events.add(250, function(){puff.on = false;puff.kill();this.destroy();}, this);
    }
    
};