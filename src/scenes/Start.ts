import Phaser from 'phaser';

let isPressed =  false

export default class Bubbles extends Phaser.Scene { 

    scoring?: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super('Start')
        document.addEventListener('keyup', (e) => {
          e.preventDefault();
          if (e.key === ' ') isPressed = true
        })
    }

    preload() {
        this.load.image("blue", "/blue.png");
        this.load.image("green", "/green.png");
        this.load.image("red", "/red.png");
        this.load.image("bomb", "/bomb.png");
    }

    create() {
        this.scoring = this.physics.add.staticGroup();
        this.scoring.create(200,100, 'blue')
        this.scoring.create(200,200, 'green')
        this.scoring.create(200,300, 'red')
        this.scoring.create(200,400, 'bomb')

        this.add.text(200,15,'SCORING', {fontSize: '24px'})
        this.add.text(270,100,'500', {fontSize: '22px'})
        this.add.text(270,200,'250', {fontSize: '22px'})
        this.add.text(270,300,'-250', {fontSize: '22px'})
        this.add.text(270,400,'Hit 5 bombs and the game is over', {fontSize: '22px'})

        this.add.text(100,500, 'Hit the SPACEBAR when the bubble crosses the bar.')
        this.add.text(100,550, 'Hit the SPACEBAR to begin.')
    }

    update() {
        if (!isPressed) return
        this.scene.stop('Start')
        this.scene.remove('Start')
        this.scene.switch('Bubbles')
        this.scene.start('Bubbles')
        isPressed= false
    }
}