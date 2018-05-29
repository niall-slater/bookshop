/* GLOBALS */

//Groups
var groupBackground;
var groupCharacters;
var groupItems;

//Tilemap layers
var layer0;


//Scenery & Objects
var map;


//UI
var slickUI;

var playState = {
    
    //State Information
	
	preload: function() {
		groupBackground = game.add.group();
		groupCharacters = game.add.group();
        groupItems = game.add.group();
		
		//Slick UI library
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
	},

	create: function () {
		
		game.stage.backgroundColor = '#2d2d2d';
		
		map = game.add.tilemap();
		map.addTilesetImage('sheet_tiles');
		
		var size = 50;
		
		layer0 = map.create('level0', size, size, 16, 16);
    	layer0.scrollFactorX = 0.5;
    	layer0.scrollFactorY = 0.5;
		layer0.resizeWorld();
		
		for (var i = 0; i < size; i++) { 
			for (var j = 0; j < size; j++) { 
				map.putTile(i, i, j, layer0);
			}
		}

		
		
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