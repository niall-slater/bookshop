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
		menuMain.panel.buttonNewGame.events.onInputUp.add(this.openNewGameMenu);
		menuMain.panel.buttonLoadGame.events.onInputUp.add(this.loadGame);
		
		
		//set up new game panel
		slickUI.add(menuStart.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		
		menuStart.panel.add(menuStart.panel.title = new SlickUI.Element.Text(110, 5, 'New Game', 14, styleDark));
		menuStart.panel.add(menuStart.panel.buttonStart = new SlickUI.Element.Button(2, 32, 200, 32));
		menuStart.panel.buttonStart.add(new SlickUI.Element.Text(8,4, 'Start', 10, styleDark));
		menuStart.panel.add(menuStart.panel.buttonCancel = new SlickUI.Element.Button(2, 32 + 32 + 14, 200, 32));
		menuStart.panel.buttonCancel.add(new SlickUI.Element.Text(8,4, 'Cancel', 10, styleDark));
		
		
		//set button functions
		menuStart.panel.buttonStart.events.onInputUp.add(this.startGame);
		menuStart.panel.buttonCancel.events.onInputUp.add(this.cancel);
		
		menuStart.panel.visible = false;
		
		
		//Set up fullscreen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		game.scale.refresh();
	},
	
	openNewGameMenu: function() {
		menuMain.panel.visible = false;
		menuStart.panel.visible = true;
	},
	
	loadGame: function() {
		console.log("Loading games isn't yet implemented. Soz!");
	},
	
	cancel: function() {
		menuStart.panel.visible = false;
		menuMain.panel.visible = true;
	},
	
	startGame: function() {
		game.state.start('play');
	},
};