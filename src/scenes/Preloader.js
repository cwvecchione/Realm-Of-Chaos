export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init ()
    {
        const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(1, 0xB71300);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centerX - 230, centerY, 4, 28, 0xB71300);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('../../assets');
        // load images
        this.loadImages();
        // load spritesheets
        this.loadSpriteSheets();
        // load audio
        this.loadAudio();
        // load tilemap
        this.loadTileMap();
    }

    loadImages() {
      this.load.image('titleBackground', '/images/titleBackground_v2.png');  
      this.load.image('button1', '/images/ui/blue_button01.png');
      this.load.image('button2', '/images/ui/blue_button02.png');
        
      // load the map tileset image
      this.load.image('background', '/level/background-extruded.png');

      this.load.image('inventoryShield', '/images/condensation_shield_new.png');
      this.load.image('inventoryGold', '/images/gold_pile_16.png');
      this.load.image('inventoryButton', '/images/instructions.png');
      this.load.image('inventorySword', '/images/infusion.png');
      this.load.image('inventoryRemove', '/images/prompt_no.png');
      this.load.image('inventoryHeart', '/images/regeneration_new.png');
    }

    loadSpriteSheets() {
        this.load.spritesheet('items', '/images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('characters', '/images/characters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('monsters', '/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('tools', '/images/tools.png', { frameWidth: 32, frameHeight: 32 });
    }

    loadAudio() {
        this.load.audio('goldSound', ['/audio/CoinsBag.mp3']);
        this.load.audio('enemyDeath', ['/audio/BeastDeath.mp3']);
        this.load.audio('playerAttack', ['/audio/PlayerAttack.wav']);
        this.load.audio('playerDamage', ['/audio/PlayerDamage.wav']);
        this.load.audio('playerDeath', ['/audio/MaleDeath.mp3']);
        this.load.audio('bgm1', ['/audio/RushIntoAction.mp3']);
        this.load.audio('bgm2', ['/audio/EnemyAce.mp3']);
        this.load.audio('bgm3', ['/audio/HeartsOnFire.mp3']);
        this.load.audio('bgm4', ['/audio/CriticalManeuvers.mp3']);
        this.load.audio('bgm5', ['/audio/GunbladeDuel.mp3']);
        this.load.audio('bgm6', ['/audio/RivalsForever.mp3']);
    }

    loadTileMap() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/level/large_level.json');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Title');
    }
}
