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
		
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resize your window to see the stage resize too
		game.scale.setShowAll();
		game.scale.refresh();

		
		game.stage.backgroundColor = '#3fa7ff';
		
		map = game.add.tilemap('map_bookshop_building');
		map.addTilesetImage('roguelike_general', 'tiles_roguelike');

		//  Create our layer
		
		layer0 = map.createLayer('building');
		layer0.resizeWorld();
		layer1 = map.createLayer('fixtures');
		layer1.resizeWorld();
		layer2 = map.createLayer('furniture');
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