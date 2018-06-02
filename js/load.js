var loadState = {
	
	preload: function() {
		
		var loadingLabel = game.add.text(80, 150, "loading...", {font: "30px Arial", fill: "#fff"});
		
        
		/* SPRITES */
		
		//Scenery & Objects
        game.load.image('tiles_roguelike', 'res/tiles/roguelikeSheet_transparent.png');
        game.load.tilemap('map_bookshop_building', 'res/maps/bookshop.json', null, Phaser.Tilemap.TILED_JSON);
		
		//Characters
        game.load.spritesheet('sprites_characters', 'res/tiles/roguelikeChar_transparent.png', 16, 16, 0, 1);
        
		/* AUDIO */
		//game.load.audio('music_airshipSerenity', 'res/audio/Airship Serenity.mp3');
		
		/* DATA */
		
		//Data
		game.load.json("data_books", "res/data/data_books.json");
        
	},
	
	create: function() {
        
		//mapData.systems = game.cache.getJSON('data_books');
		
		game.state.start('menu');
	}
	
};