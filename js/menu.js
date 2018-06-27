//MENU OBJECTS

let menuMain = {};
let menuStart = {};

var menuState = {
	
	preload: function() {
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
	},
	
	create: function() {
		
		let panel;
		
		//set up main menu panel
		slickUI.add(menuMain.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		
		menuMain.panel.add(menuMain.panel.title = new SlickUI.Element.Text(110, 5, 'Ultra Sim Bookshop 2002', 14, styleDark));
		menuMain.panel.add(menuMain.panel.buttonNewGame = new SlickUI.Element.Button(2, 32, 200, 32));
		menuMain.panel.buttonNewGame.add(new SlickUI.Element.Text(8,4, 'New Game', 10, styleDark));
		menuMain.panel.add(menuMain.panel.buttonLoadGame = new SlickUI.Element.Button(2, 32 + 32 + 14, 200, 32));
		menuMain.panel.buttonLoadGame.add(new SlickUI.Element.Text(8,4, 'Load Game', 10, styleDark));
		
		
		//set button functions
		menuMain.panel.buttonNewGame.events.onInputUp.add(this.startGame);
		menuMain.panel.buttonLoadGame.events.onInputUp.add(this.loadGame);
		
		
		
		//Set up fullscreen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		game.scale.refresh();
	},
	
	startGame: function() {
		game.state.start('play');
	},
	
	loadGame: function() {
		console.log("Loading games isn't yet implemented. Soz!");
	}
};