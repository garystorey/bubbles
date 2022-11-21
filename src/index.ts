import Phaser from 'phaser';
import config from './config';
import {Game,Start} from './scenes';

new Phaser.Game(
  Object.assign(config, {
    scene: [Start,Game]
  })
);
