class Customer extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sheet_char');
		
        //this.frame = spriteIndex;
		this.name = generateName();
        
        this.anchor.setTo(0.5, 0.5);
        
        this.behaviours = {
            BROWSE: 0,
            BUY: 1,
            LEAVE: 2,
			IDLE: 3
        };
        this.behaviour_current = this.behaviours.BROWSE;
		this.browseTarget = playState.getRandomNavPointBooks();
		
		this.animSpeed = 8;
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
            case this.behaviours.BROWSE: {
				
				this.animations.play('anim_walk', this.animSpeed, true);
                game.physics.arcade.moveToXY(this, this.browseTarget.x, this.browseTarget.y, this.moveSpeed);
				
				
                if (Math.abs(this.x - this.browseTarget.x) < 1 && Math.abs(this.y - this.browseTarget.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					this.animations.play('anim_idle', this.animSpeed, true);
					
					let decisiveness = 0.9;
					
					//Randomly choose whether to buy this book or browse for another
					if (Math.random() < decisiveness) {
						//BUY!
    					if (gameData.bookStock.length < 1) {
							this.say('No new books?');
							playState.popularityDecrease(2);
							if (Math.random() > 0.5) {
								game.time.events.add(200, this.makeMess, this);
							}	
							game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.LEAVE}, this);
							break;
							
						}
						this.say('This one!')
						if (Math.random() > 0.8) {
							game.time.events.add(200, this.makeMess, this);
						}
						game.time.events.add(Phaser.Timer.SECOND, function(){this.behaviour_current = this.behaviours.BUY}, this);
						this.animations.play('anim_interact', 8, false);
						playState.popularityIncrease(1);
					} else {
						//Nah
						if (Math.random() > 0.8) {
							game.time.events.add(500, this.makeMess, this);
						}
						this.say('Nah.')
    					game.time.events.add(Phaser.Timer.SECOND * 2, function(){this.browseTarget = playState.getRandomNavPointBooks(); this.behaviour_current = this.behaviours.BROWSE;}, this);
					}
                }
                break;
            }
            case this.behaviours.BUY: {
                game.physics.arcade.moveToXY(this, point_buy.x, point_buy.y, this.moveSpeed);
				this.animations.play('anim_walk', 8, false);
                if (Math.abs(this.x - point_buy.x) < 1 && Math.abs(this.y - point_buy.y) < 1) {
					this.animations.play('anim_interact', 8, false);
                    this.behaviour_current = this.behaviours.IDLE;
					let book = this.selectBook();
					if (book === undefined) {
						game.time.events.add(500, this.makeMess, this);
						this.say('Not for sale?')
						console.log(this.name + " couldn't find the book they wanted.");
						playState.popularityDecrease(2);
						this.behaviour_current = this.behaviours.LEAVE;
						break;
					}
					playState.makeSale(book);
					
					this.say('Thank you!');
//					console.log(this.name + " bought a copy of " + book.title);
					
                    game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.LEAVE}, this);
                }
                break;
            }
            case this.behaviours.LEAVE: {
				this.animations.play('anim_walk', 8, false);
                game.physics.arcade.moveToXY(this, point_exit.x, point_exit.y, this.moveSpeed);
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
    
	selectBook() {
		let result = gameData.bookStock[Math.floor(Math.random() * gameData.bookStock.length)];
		
		//Loop through stocked books and *probably* pick the one with the highest current interest
		let bestInterest = 0;
		let peerPressureCoefficient = 0.9;
		
		//get the most popular book
		for (var b in gameData.bookStock) {
			if (currentInterests[b.tag] > bestInterest) {
				bestInterest = currentInterests[b.tag];
				result = b;
			}
		}
		
		if (result === undefined) {
			//The book has vanished on the way to the till, probably because the player returned the stock
			//this shouldn't really happen unless there's only like one book in stock
			return undefined;
			
		}
		
		//test against peer pressure to try and buy a random book instead
		//if the book's demand is low (it reduces over time while in stock) then try to find another
		//this makes unpopular books stay on the shelf forever until you return them at a loss
		let cantShiftThisBookDemandThreshold = 5;
		if (Math.random() > peerPressureCoefficient || result.demand < cantShiftThisBookDemandThreshold) {
			result = gameData.bookStock[Math.floor(Math.random() * gameData.bookStock.length)];
		}
		
		return result;
	}
	
    die() {
        this.destroy();
    }
	
	makeMess() {
		let mess = new Mess(game, this.x, this.y);
		groupItems.add(mess);
	}
	
	say(text) {
		let bubble = new SpeechBubble(game, this.x - 15, this.y - 30, text);
		groupEffects.add(bubble);
	}
    
};