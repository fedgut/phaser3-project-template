import Phaser from 'phaser';
import gameScene from '../scenes/gameScene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [gameScene],
};

export default config;
