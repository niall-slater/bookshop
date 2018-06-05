/* GLOBALS */

//Groups
var groupBackground;
var groupCharacters;
var groupItems;

//Tilemap layers
var layer0;
var layer1;
var layer2;

//Scenery & Objects
var map;

//Nav
var navPoints_books;

var point_enter = {
	x: 8,
	y: 72
}
var point_exit = {
	x: 8,
	y: 120
}
var point_buy = {
	x: 280,
	y: 88
}

var spawnMax = 10000;
var spawnTimer = spawnMax;

//UI
var slickUI;

var playState = {
    
    //State Information
	
	preload: function() {
        
		
		//Slick UI library
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		groupCharacters = game.add.group();
	},

	create: function () {
		
		//Start physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.world.setBounds(0, 0, mapWidthDefault, mapHeightDefault);
		
		//Set up fullscreen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		game.scale.refresh();
		
		//Create map
		map = game.add.tilemap('map_bookshop_building');
		map.addTilesetImage('roguelike_general', 'tiles_roguelike');
		layer0 = map.createLayer('building');
		layer0.resizeWorld();
		layer1 = map.createLayer('fixtures');
		layer1.resizeWorld();
		layer2 = map.createLayer('furniture');
		layer2.resizeWorld();
		
		//Load nav points
		
		navPoints_books = [
			{x: 24, y: 56},
			{x: 56, y: 56},
			{x: 104, y: 56},
			{x: 136, y: 56},
			{x: 168, y: 56},
			{x: 200, y: 56},
			{x: 72, y: 72},
			{x: 72, y: 120},
			{x: 120, y: 72},
			{x: 120, y: 120},
			{x: 184, y: 72},
			{x: 184, y: 120},
			{x: 232, y: 120}
		];		
		//At this point I'm hardcoding them but the easiest dynamic way will be to read
		//directly from the Tiled JSON export. Don't use the Phaser functions for this.
		
		game.world.bringToTop(groupCharacters);
		
		game.time.events.loop(Phaser.Timer.SECOND * 4, this.spawnCustomer, this);

        this.spawnCustomer();
		
	},
	
	update: function() {
		
		//tick spawn timer
		spawnTimer -= game.time.physicsElapsed;
	},
	
	render: function() {
		
	},
	
    spawnCustomer: function() {
		
		let maxChars = 15; //this is the number of characters in the spritesheet
		let selector = Math.floor(Math.random() * maxChars);
		
        let customer = new Customer(game, selector, point_enter.x, point_enter.y);
		groupCharacters.add(customer);
        
		
	},
	
    fullScreenToggle: function() {
        
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    },
	

	getRandomNavPointBooks: function() {
		return navPoints_books[Math.floor(Math.random() * navPoints_books.length)];
	}
	
};

class Customer extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sprites_characters');

        this.frame = spriteIndex;
        
        this.anchor.setTo(0.5, 0.5);
        
        this.behaviours = {
            BROWSE: 0,
            BUY: 1,
            LEAVE: 2
        };
        this.behaviour_current = this.behaviours.BROWSE;
		this.browseTarget = playState.getRandomNavPointBooks();
        
        this.bobMax = 1;
        this.bobTimer = 1;
        
        game.add.existing(this);
        game.physics.arcade.enable(this);
        
        //game.add.tween(this).to({ x: point_get.x, y: point_get.y}, 3000, Phaser.Easing.Linear.None, true);
    }
    
    update() {
        
        //Add reference to this so we can use it in anonymous functions without problems
        var me = this;
		//That said, this isn't necessary if using game.time.events.add instead of setTimeout, which you should be.
        
        this.bobTimer -= game.time.physicsElapsed;
        
        if (this.bobTimer <= 0)
        {
            this.bob();
            this.bobTimer = this.bobMax;
        }
        
        switch (this.behaviour_current) {
            case this.behaviours.BROWSE: {
                game.physics.arcade.moveToXY(this, this.browseTarget.x, this.browseTarget.y, 50);
                if (Math.abs(this.x - this.browseTarget.x) < 1 && Math.abs(this.y - this.browseTarget.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					
					//Randomly choose whether to buy this book or browse for another
					if (Math.random() > 0.5) {
						//BUY!
    					game.time.events.add(Phaser.Timer.SECOND, function(){this.behaviour_current = this.behaviours.BUY}, this);
					} else {
						//Nah
    					game.time.events.add(Phaser.Timer.SECOND * 2, function(){this.browseTarget = playState.getRandomNavPointBooks(); this.behaviour_current = this.behaviours.BROWSE}, this);
					}
                }
                break;
            }
            case this.behaviours.BUY: {
                game.physics.arcade.moveToXY(this, point_buy.x, point_buy.y, 50);
                if (Math.abs(this.x - point_buy.x) < 1 && Math.abs(this.y - point_buy.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
                    setTimeout(function(){me.behaviour_current = me.behaviours.LEAVE}, 1000);
                }
                break;
            }
            case this.behaviours.LEAVE: {
                game.physics.arcade.moveToXY(this, point_exit.x, point_exit.y, 50);
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
    
    bob() {
        
    }
    
    die() {
        this.destroy();
    }
    
};