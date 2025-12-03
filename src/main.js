import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Title } from './scenes/Title.js'
import { Game } from './scenes/Game.js';
import Ui from './scenes/UiScene.js';
import { GameOver } from './scenes/GameOver.js';
import {CharacterSelection} from './scenes/CharacterSelectionScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'CW Adventure World',
    version: '0.2.0',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        Title,
        CharacterSelection,
        Game,
        Ui,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            