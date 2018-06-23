var loadState = {
	
	preload: function() {
		
		var loadingLabel = game.add.text(80, 150, "loading...", {font: "30px Arial", fill: "#fff"});
		
        
		/* SPRITES */
		
		//Scenery & Objects
        game.load.image('tiles_roguelike', 'res/tiles/roguelikeSheet_transparent.png');
        game.load.tilemap('map_bookshop_building', 'res/maps/bookshop.json', null, Phaser.Tilemap.TILED_JSON);
		
		//Characters
		let maxChars = 17; //this is the number of characters in the spritesheet
        game.load.spritesheet('sprites_characters', 'res/tiles/roguelikeChar_transparent.png', 16, 16, maxChars, 0, 1);
		
		game.load.spritesheet('sheet_char', 'res/tiles/char.png', 16, 16);
		game.load.spritesheet('sheet_author', 'res/tiles/author.png', 16, 16);
        
		//Objects
		game.load.image('sprite_bubble', 'res/objects/bubble.png');
		
		for (var i = 0; i < 4; i++) {
			game.load.image('sprite_bookPile_' + i, 'res/objects/bookPile_' + i + '.png');
		}
		
		game.load.image('particle_puff', 'res/objects/particle.png');
		
        //UI images
        game.load.image('sheet_books', 'res/ui/sheet_books.png', 16, 16, 12, 0, 0);
		
		for (var i = 0; i < 12; i++) {
        	game.load.image('sprite_book' + i, 'res/ui/sprite_book' + i + '.png', 16, 16, 12, 0, 0);
		}
        
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