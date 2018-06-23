class SpeechBubble extends Phaser.Sprite {
	
    constructor(game, x, y, text) {
        super(game, 0, 0);
		
		let width = 50;
		let height = 20;
		
        y = y + Math.random() * 6 - 3;
		
		this.anchor.setTo(0.5, 0.5);
		
		this.background = Phaser.Sprite.call(this, game, x, y, '');
		
        this.background = new Phaser.Sprite(game, 0, 0, 'sprite_bubble');
		
		this.lifeTime = 1;
		
		let padding = 2;
		
		this.phrase = game.add.text(padding, padding, text, styleDarkSmall);
		
		//groupText.add(this.phrase);
		this.addChild(this.background);
		this.addChild(this.phrase);
		this.phrase.setTextBounds(padding, padding);
		
		
		let stretch = padding * 2 + text.length * 5;
		
		if (stretch < 1) {
			stretch = 1;
		}
		
		this.background.width = stretch;
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