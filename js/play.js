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


//UI
var slickUI;

var playState = {
    
    //State Information
	
	preload: function() {
		
		//Slick UI library
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
	},

	create: function () {
		
		game.stage.backgroundColor = '#3fa7ff';
		
		map = game.add.tilemap('map_bookshop_building', 16, 16);
		map.addTilesetImage('roguelike_transparent.tsx', 'tiles_roguelike', 16, 16, 0, 1);
		map.addTilesetImage('roguelikeIndoor_transparent.tsx', 'tiles_roguelike', 16, 16, 0, 1);

		//  Create our layer
		
		layer0 = map.createLayer(0);
		layer0.resizeWorld();
		
		layer1 = map.createLayer(1);
		layer1.resizeWorld();
		
		layer2 = map.createLayer(2);
		layer2.resizeWorld();
		
	},
	
	update: function() {
		
	},
	
	render: function() {
		
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