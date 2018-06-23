class Bookseller extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sheet_bookseller');
		
        //this.frame = spriteIndex;
		this.name = generateName();
        
        this.anchor.setTo(0.5, 0.5);
		
		this.inputEnabled = true;
    	this.events.onInputDown.add(this.onTap, this);
		
		this.animSpeed = 4;
		
        this.anim_idle = this.animations.add('anim_idle', [0]);
        this.anim_walk = this.animations.add('anim_walk', [0,1]);
        this.anim_interact = this.animations.add('anim_interact', [2,3]);
		
        game.add.existing(this);
        game.physics.arcade.enable(this);
		this.animations.play('anim_walk', this.animSpeed, true);
    }
    
    update() {
		
    }
	
	say(text) {
		let bubble = new SpeechBubble(game, this.x - 12, this.y - 30, text);
		groupEffects.add(bubble);
	}
	
	onTap() {
		let saying = 'Hello!';
		let selector = Math.floor(Math.random() * 3);
		switch(selector) {
			case 0: saying = 'Hi!'; break;
			case 1: saying = "Good job!"; break;
			case 2: saying = "Books!"; break;
			default: saying = "Uhh"; break;
		}
		this.say(saying);
		this.animations.play('anim_interact', this.animSpeed, false);
		
	}
    
};