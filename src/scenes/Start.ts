import Phaser from 'phaser';

let isPressed =  false

export default class Start extends Phaser.Scene { 

    scoring?: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super('Start')
        document.addEventListener('keyup', (e) => {
          e.preventDefault();
          if (e.key === 'Enter') isPressed = true
        })
    }

    preload() {
        this.load.image("blue", "/blue.png");
        this.load.image("green", "/green.png");
        this.load.image("red", "/red.png");
        this.load.image("bomb", "/bomb.png");
    }

    create() {

        this.add.rectangle(0,0,1200,900,'#333','.25')
        this.scoring = this.physics.add.staticGroup();
        this.scoring.create(100,100, 'blue')
        this.scoring.create(100,200, 'green')
        this.scoring.create(100,300, 'red')
        this.scoring.create(100,400, 'bomb')


        this.add.text(150,15,'SCORING', {fontSize: '32px'})
        this.add.text(200,100,'500 points', {fontSize: '22px'})
        this.add.text(200,200,'250 points', {fontSize: '22px'})
        this.add.text(200,300,'-250 points', {fontSize: '22px'})
        this.add.text(200,400,'Hit 5 bombs and game over!', {fontSize: '22px'})

        this.add.text(0,500, 'Press SPACE when the bubble crosses the line',{fontSize: '22px'})
        this.add.text(50,550, 'Press ENTER to begin.',{fontSize: '38px'})
    }

    update() {
        if (!isPressed) return
        this.scene.stop('Start')
        this.scene.start('Bubbles')
        isPressed= false
    }
}