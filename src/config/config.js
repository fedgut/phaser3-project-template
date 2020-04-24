import Phaser from 'phaser';
import GameScene from '../scenes/gameScene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [GameScene],
};

export default config;
