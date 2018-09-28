class Trolley extends Phaser.Sprite {
    
    constructor(game, x, y, contents) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, gameWidth + 50, point_bookseller.y + 16, 'sprite_bookTrolley');
        
        this.anchor.setTo(0.5, 0.5);
		
		this.inputEnabled = true;
    	this.events.onInputDown.add(this.onTap, this);
		
		this.moveSpeed = 50;
		
        game.add.existing(this);
        game.physics.arcade.enable(this);
        
        this.books = contents;
        
        let targetPos = {x: point_bookseller.x + 16, y: point_bookseller.y + 16};
        
        let tween = game.add.tween(this).to(targetPos, 900, Phaser.Easing.Bounce.In, true);
        	
        tween.onComplete.add(this.onArrive, this);
		playState.bookseller.say("Order's here!");
    }
    
    update() {
        
    }
	
    die() {
        this.destroy();
    }
    
    onArrive() {
        
    }
    
	onTap() {
		
		playState.bookseller.say("I'll stock 'em.");
		
        for (let i = 0; i < this.books.length; i++)
            gameData.bookStock.push(this.books[i]);
        
        playState.buildStock();
        
        this.books = [];
        
        let targetPos = {x: gameWidth + 50, y: point_bookseller.y + 16};

        let tween = game.add.tween(this).to(targetPos, 900, Phaser.Easing.Bounce.Out, true);
        
        tween.onComplete.add(this.die, this);

	}
};