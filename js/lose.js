var loseMenu = {};

var loseState = {
	
	preload: function() {
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		game.add.plugin(PhaserInput.Plugin);
	},
	
	create: function() {
		
		let panel;
		
		//set up main menu panel
		slickUI.add(loseMenu.panel = new SlickUI.Element.Panel(0, 0, gameWidth, gameHeight));
		
		loseMenu.panel.add(loseMenu.panel.title = new SlickUI.Element.Text(0,5, 'Game Over', 14, styleDarkBig)).centerHorizontally();
		loseMenu.panel.add(loseMenu.panel.buttonNewGame = new SlickUI.Element.Button(gameWidth/2-uiSize.buttonWidth/2, 100, uiSize.buttonWidth, uiSize.buttonHeight));
		loseMenu.panel.buttonNewGame.add(new SlickUI.Element.Text(0,0, 'Play Again', 10, styleDarkBig)).centerHorizontally();
		
		//set button functions
		loseMenu.panel.buttonNewGame.events.onInputUp.add(this.restart);
	},
	
	restart: function() {
		game.state.start('menu');
	}
};