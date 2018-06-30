var slickUI;

var savedGames = [];


var fontStyle = { font: "10px sans-serif", fill: "#fff", boundsAlignH: "left", boundsAlignV: "bottom", wordWrap: "true", wordWrapWidth: 330};
var styleDark = { font: "10px sans-serif", fill: "#333", boundsAlignH: "left", boundsAlignV: "bottom", wordWrap: "true", wordWrapWidth: 330, fontWeight: 600};
var styleDarkWrap = { font: "10px sans-serif", fill: "#333", boundsAlignH: "left", boundsAlignV: "top", wordWrap: "true", wordWrapWidth: 90, fontWeight: 600};
var styleBookTitle = { font: "12px sans-serif", fill: "#333", boundsAlignH: "left", boundsAlignV: "top", wordWrap: "true", wordWrapWidth: 90, fontWeight: 600};
var styleDarkBig = { font: "15px sans-serif", fill: "#333", fontWeight: 600, boundsAlignV: "top"};
var styleDarkSmall = { font: "8px sans-serif", fill: "#333", fontWeight: 600};
var styleTitle = { font: "20px sans-serif", fill: "#333", fontweight: 800};
var styleTicker = { font: "14px sans-serif", fill: "#eee", fontweight: 800};

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
		game.load.spritesheet('sheet_bookseller', 'res/tiles/bookseller.png', 16, 16);
        
		//Objects
		game.load.image('sprite_bubble', 'res/objects/bubble.png');
		
		for (var i = 0; i < 4; i++) {
			game.load.image('sprite_bookPile_' + i, 'res/objects/bookPile_' + i + '.png');
		}
		
		game.load.image('particle_puff', 'res/objects/particle.png');
		
        //UI images
        game.load.image('sprite_title', 'res/ui/title.png');
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