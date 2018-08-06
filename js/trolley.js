class Trolley extends Phaser.Sprite {
    
    constructor(game, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, gameWidth + 50, point_bookseller.y + 16, 'sprite_bookTrolley');
        
        this.anchor.setTo(0.5, 0.5);
		
		this.inputEnabled = true;
    	this.events.onInputDown.add(this.onTap, this);
		
		this.moveSpeed = 50;
		
        game.add.existing(this);
        game.physics.arcade.enable(this);
        
        let targetPos = {x: point_bookseller.x + 16, y: point_bookseller.y + 16};
        
        game.add.tween(this).to(targetPos, 900, Phaser.Easing.Bounce.In, true);
    }
    
    update() {
        
    }
	
    die() {
        this.destroy();
    }
    
	onTap() {
        console.log('tapped the books');
	}
    
};