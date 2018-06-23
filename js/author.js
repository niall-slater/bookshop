class Author extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sheet_author');
		
        //this.frame = spriteIndex;
		this.name = generateName();
        
        this.anchor.setTo(0.5, 0.5);
		
		this.inputEnabled = true;
    	this.events.onInputDown.add(this.onTap, this);
		
        
        this.behaviours = {
            MEDDLE: 0,
            FLEE: 1,
            LEAVE: 2,
			IDLE: 3
        };
        this.behaviour_current = this.behaviours.MEDDLE;
		this.browseTarget = playState.getRandomNavPointBooks();
		
		this.animSpeed = 4;
		this.moveSpeed = 50;
		
        this.anim_idle = this.animations.add('anim_idle', [0]);
        this.anim_walk = this.animations.add('anim_walk', [0,1]);
        this.anim_interact = this.animations.add('anim_interact', [2,3]);
		
        game.add.existing(this);
        game.physics.arcade.enable(this);
		this.animations.play('anim_walk', this.animSpeed, true);
    }
    
    update() {

        switch (this.behaviour_current) {
            case this.behaviours.MEDDLE: {
				
				this.animations.play('anim_walk', this.animSpeed, true);
                game.physics.arcade.moveToXY(this, this.browseTarget.x, this.browseTarget.y, this.moveSpeed);
				
				
                if (Math.abs(this.x - this.browseTarget.x) < 1 && Math.abs(this.y - this.browseTarget.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					this.animations.play('anim_idle', this.animSpeed, true);
					
					this.say("Sneaky author tee hee");
					this.animations.play('anim_interact', 8, false);
					game.time.events.add(200, this.makeMess, this);
					game.time.events.add(400, this.makeMess, this);
					game.time.events.add(600, this.makeMess, this);
					
					game.time.events.add(800, function(){
						this.browseTarget = playState.getRandomNavPointBooks();
						this.behaviour_current = this.behaviours.MEDDLE;
					}, this);
                }
                break;
            }
            case this.behaviours.FLEE: {
				//TODO: add flee behaviour triggered by player touch
				this.animations.play('anim_walk', this.animSpeed * 4, true);
				/*
				let randomPoint = playState.getRandomNavPointFlee();
                game.physics.arcade.moveToXY(this, randomPoint.x, randomPoint.y, this.moveSpeed * 2);
				game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.MEDDLE}, this);
				*/
                break;
            }
            case this.behaviours.LEAVE: {
				this.animations.play('anim_walk', this.animSpeed * 2, false);
                game.physics.arcade.moveToXY(this, point_exit.x, point_exit.y, this.moveSpeed * 2);
                if (Math.abs(this.x - point_exit.x) < 1 && Math.abs(this.y - point_exit.y) < 1) {
                    this.behaviour_current = -1;
                    this.die();
                }
                break;
            }
            case this.behaviours.IDLE: {
                this.body.velocity.setTo(0,0);
                break;
            }
        }
    }
	
    die() {
        this.destroy();
    }
	
	makeMess() {
		let mess = new Mess(game, this.x, this.y);
		groupItems.add(mess);
	}
	
	say(text) {
		let bubble = new SpeechBubble(game, this.x - 25, this.y - 30, text);
		groupEffects.add(bubble);
	}
	
	onTap() {
		this.say('Ahh!');
		this.behaviour_current = this.behaviours.LEAVE;
	}
    
};