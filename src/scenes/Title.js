import UiButton from '../classes/UiButton.js';

export class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create ()
    {
    
      // add background image centered on screen
      this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'titleBackground');
      this.background.setOrigin(0.5, 0.5);
      
      // scale image to fit within viewport
      const scaleX = this.scale.width / this.background.width;
      const scaleY = this.scale.height / this.background.height;
      const scale = Math.min(scaleX, scaleY) * 0.95;
      this.background.setScale(scale);

      // create title text at bottom of screen
      this.titleText = this.add.text(this.scale.width / 2, this.scale.height - 40, 'Press any key to start', { fontSize: '20px', fill: '#fff' });
      this.titleText.setOrigin(0.5);

      // create the Play game button
      //this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Start', this.startScene.bind(this, 'CharacterSelection'));
      
      // listen for any key press to start the game
      this.input.keyboard.on('keydown', () => {
        this.startScene('CharacterSelection');
      });
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
    }

}
