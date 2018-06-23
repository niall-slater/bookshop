class SpeechBubble extends Phaser.Sprite {
	
    constructor(game, x, y, text) {
        super(game, 0, 0);
		
		let width = 50;
		let height = 20;
		
        Phaser.Sprite.call(this, game, x, y, 'sprite_bubble');
		
		this.lifeTime = 1;
		
		let padding = 2;
		
		this.phrase = game.add.text(padding, padding, text, styleDarkSmall);
		this.phrase.setTextBounds(x+padding, y+padding, x+width-padding, y+height-padding);
		
		groupText.add(this.phrase);
		
		let stretch = text.length / 10;
		
		if (stretch < 1) {
			stretch = 1;
		}
		
		this.scale.setTo(stretch, 1);
		
    }
    
    update() {
		
		if (this.lifeTime > 0) {
        	this.lifeTime -= game.time.physicsElapsed;
		} else {
			this.phrase.destroy();
			this.destroy();
		}
    }
    
};