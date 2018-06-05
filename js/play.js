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
var point_enter = {
	x: 8,
	y: 72
}
var point_exit = {
	x: 8,
	y: 120
}
var point_get = {
	x: 200,
	y: 70
}
var point_buy = {
	x: 280,
	y: 88
}

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
		
		game.world.bringToTop(groupCharacters);
		//setInterval(this.spawnCustomer, 2000);
        this.spawnCustomer();
		
	},
	
	update: function() {
		
	},
	
	render: function() {
		
	},
	
    spawnCustomer: function() {
		
		let maxChars = 15; //this is the number of characters in the spritesheet
		let selector = Math.floor(Math.random() * maxChars);
		
		//let customer = game.add.sprite(point_enter.x - 8, point_enter.y - 8, 'sprites_characters');
		
        let customer = new Customer(game, selector, point_enter.x, point_enter.y);
        
        /* Initialising this here feels very wrong. TODO: Find out how to declare variables inside the customer class without an error */
        customer.behaviours = {
            BROWSE: 0,
            BUY: 1,
            LEAVE: 2
        };
        
        customer.behaviour_current = customer.behaviours.BROWSE;
        /* */
        
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
    }
	
};

class Customer extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sprites_characters');

        this.frame = spriteIndex;
        
        this.anchor.setTo(0.5, 0.5);

        game.add.existing(this);
        game.physics.arcade.enable(this);
        
        //game.add.tween(this).to({ x: point_get.x, y: point_get.y}, 3000, Phaser.Easing.Linear.None, true);
    }
    
    update() {
        
        switch (this.behaviour_current) {
            case this.behaviours.BROWSE: {
                game.physics.arcade.moveToXY(this, point_get.x, point_get.y, 50);
                if (Math.abs(this.x - point_get.x) < 1 && Math.abs(this.y - point_get.y) < 1) {
                    console.log("Book located");
                    this.switchBehaviourBuy();
                }
                break;
            }
            case this.behaviours.BUY: {
                game.physics.arcade.moveToXY(this, point_buy.x, point_buy.y, 50);
                if (Math.abs(this.x - point_buy.x) < 1 && Math.abs(this.y - point_buy.y) < 1) {
                    console.log("Book purchased");
                    this.switchBehaviourLeave();
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
        }
        
    }
    
    switchBehaviourBuy() {
        this.behaviour_current = 1;
    }
    
    switchBehaviourLeave() {
        this.behaviour_current = 2;
    }
    
    die() {
        console.log("Ded");
        this.destroy();
    }
    
};