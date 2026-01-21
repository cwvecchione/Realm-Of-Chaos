import UiButton from '../classes/UiButton.js';

export class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create ()
    {
    
      // add background image
      this.background = this.add.image(0, 0, 'titleBackground');
      //this.background.scale = this.scale * 2;
      this.background.setOrigin(0, 0);

      // create title text
      this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Realm Of Chaos', { fontSize: '64px', fill: '#fff' });
      this.titleText.setOrigin(0.5);

      // create the Play game button
      this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Start', this.startScene.bind(this, 'CharacterSelection'));
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
    }

}
