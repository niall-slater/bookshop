//MENU OBJECTS

let menuMain = {};
let menuStart = {};

var shopName = 'Moistrocks';

var menuState = {
	
	preload: function() {
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		game.add.plugin(PhaserInput.Plugin);
	},
	
	create: function() {
		
		let panel;
		
		//set up main menu panel
		slickUI.add(menuMain.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		
		menuMain.panel.add(menuMain.panel.title = new SlickUI.Element.Text(110, 5, 'Super Sim Bookshop 2002', 14, styleDark));
		menuMain.panel.add(menuMain.panel.buttonNewGame = new SlickUI.Element.Button(2, 32, 200, 32));
		menuMain.panel.buttonNewGame.add(new SlickUI.Element.Text(8,4, 'New Game', 10, styleDark));
		menuMain.panel.add(menuMain.panel.buttonLoadGame = new SlickUI.Element.Button(2, 32 + 32 + 14, 200, 32));
		menuMain.panel.buttonLoadGame.add(new SlickUI.Element.Text(8,4, 'Load Game', 10, styleDark));
		
		
		//set button functions
		menuMain.panel.buttonNewGame.events.onInputUp.add(this.openNewGameMenu);
		menuMain.panel.buttonLoadGame.events.onInputUp.add(this.loadGame);
		
		
		//set up new game panel
		slickUI.add(menuStart.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		//title
		menuStart.panel.add(menuStart.panel.title = new SlickUI.Element.Text(110, 5, 'New Game', 14, styleDark));
		//start button
		menuStart.panel.add(menuStart.panel.buttonStart = new SlickUI.Element.Button(2, 32, 200, 32));
		menuStart.panel.buttonStart.add(new SlickUI.Element.Text(8,4, 'Start', 10, styleDark));
		//cancel button
		menuStart.panel.add(menuStart.panel.buttonCancel = new SlickUI.Element.Button(2, 32*5 + 14, 200, 32));
		menuStart.panel.buttonCancel.add(new SlickUI.Element.Text(8,4, 'Cancel', 10, styleDark));
		//name shop
		menuStart.panel.add(menuStart.panel.nameLabel = new SlickUI.Element.Text(8, 32 * 2 + 2, 'Bookshop Name', 14, styleDark));
		menuStart.panel.nameField = game.add.inputField(menuStart.panel.x + 14, menuStart.panel.y + 86, {padding: 4, borderRadius:2});
		menuStart.panel.nameField.visible = false;
		menuStart.panel.nameField.setText(shopName);
		
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
		menuStart.panel.nameField.visible = true;
	},
	
	loadGame: function() {
		console.log("Loading games isn't yet implemented. Soz!");
	},
	
	cancel: function() {
		menuStart.panel.visible = false;
		menuStart.panel.nameField.visible = false;
		menuMain.panel.visible = true;
	},
	
	setShopName: function(value) {
		shopName = value;
		console.log("shop name is " + shopName);
	},
	
	startGame: function() {
		menuState.setShopName(menuStart.panel.nameField.value);
		game.state.start('play');
	}
};