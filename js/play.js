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
		setInterval(this.spawnCustomer, 2000);
		
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
        
		groupCharacters.add(customer);
		
		//customer.frame = selector;
		
		//TODO: Move customer into own class so they can have an action queue
		game.add.tween(customer).to({ x: point_get.x - 8, y: point_get.y - 8 }, 3000, Phaser.Easing.Linear.None, true);
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
        super (game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sprites_characters');

        this.frame = spriteIndex;

        this.anchor.setTo(0.5, 0.5);

        game.add.existing(this);

    }
    
    update() {
        
    }
    
}