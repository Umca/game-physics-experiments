import Pony from './ship.js'
import Flower from './flower.js'
import Lemon from './lemon.js'

export default class Game{
    constructor(main){
        this.main = main
        this.keys$ = null
        this.flowers = []
        this.lemons = []
        this.edge = false
        this.end = false
        this.button = null

        this.addListener()
        this.init()
    }
    init(){
        this.addBg()
        this.createGradient()
    }

    addBg(){
        this.bg = new PIXI.Container()
        app.stage.addChild(this.bg)
        this.bg.x = 0
        this.bg.y = 0
    }

    play(){
        this.main.ticker.stop()
        this.main.ticker.add(_ => {
            this.isEnd()
            this.removeFlowers()
            this.moveFlowers()
            this.renderLemons()
            this.checkCollision()
            this.checkFlowersAmount()
            this.removeLemons()
        })
        this.main.ticker.start()
    }

    end(){
        
    }

    addElements(){
        this.addPony()
        this.addFlowers()
        this.addLemon()
    }

    checkCollision() {
        this.checkLemonCollision()
        this.checkPonyCollision()
    }
    
    checkLemonCollision() {
        this.lemons.forEach(lemon => {
            this.flowers.forEach(flower => {
                if (lemon.hits(flower)) {
                    lemon.toDelete = true
                    flower.rotate()
                }
            })
        })
    }
    
    addPony() {
        this.pony = new Pony({
            container: app.stage,
            x: app.view.width,
            y: app.view.height
        })
    }
    
    renderLemons() {
        this.lemons.forEach(lemon => lemon.fly())
    }
    
    addListener() {
        this.keys$ = Rx.Observable.fromEvent(document, 'keydown')
    }
    
    addFlowers() {
        let step = 93
    
        for (let k = 1; k < 3; k++){
            for (let i = 0; i < 5; i++) {
                let flower = new Flower({
                    container: app.stage,
                    x: step * i,
                    y: (Math.floor(Math.random() * (60 - 35)) + 45) * k
                })
    
                this.flowers.push(flower)
            }
        }
        
    }
    
    addLemon() {
        this.keys$
            .subscribe(next => {
                if (next.code === 'Space') {
                    this.lemons.push(
                        new Lemon({
                            container: app.stage,
                            x: this.pony.x ,
                            y: this.pony.y - this.pony.height / 2, 
                       })
                   )
                }
            })
    }
    
    removeLemons() {
        this.lemons.forEach((lemon, i, lemons) => {
            if (lemon.toDelete) {
                lemon.remove()
                lemons.splice(i, 1)
                i--
            }
        })
    }
    
    removeFlowers() {
        this.flowers.forEach((fl, i, flowers) => {
            if (fl.toDelete) {
                flowers.splice(i, 1)
                i--
            }
        })
    }
    
    moveFlowers() {
        this.flowers.forEach( (flower, i, flowers) => {
            flower.move()
            if (flower.reachEdge()) {
                this.edge = true 
            }
            if (this.edge) {
                flowers.forEach(fl => fl.shiftDown())
                
            }
        })
    }
    addStartScreen(){
        this.startScreen = new PIXI.Container()
        app.stage.addChild(this.startScreen)
        this.startScreen.x = 0
        this.startScreen.y = 0

        this.addDarkness()
        this.addBtn()
    }

    removeStartScreen(){
        this.startScreen.destroy()
    }
    
    addBtn() {
        this.btn = new PIXI.Sprite(PIXI.utils.TextureCache['button'])
        this.startScreen.addChild(this.btn)
        this.btn.anchor.x = 0.5
        this.btn.anchor.y = 0.5
        this.btn.x = app.view.width / 2
        this.btn.y = app.view.height / 2
        this.btn.interactive = true
        this.btn.buttonMode = true

        this.start$ = Rx.Observable.fromEvent(this.btn, 'pointerdown')

        this.startSubscription = this.start$.subscribe( next => {
            TweenMax.to(this.btn.scale, 0.3, {
                x: 0.95,
                y: 0.95,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if(this.end){
                        this.end = false
                        this.addElements()
                    }
                    setTimeout(() => {
                        this.removeStartScreen()
                        this.startSubscription.unsubscribe() 
                        this.play()
                    }, 1500)
                }
            })
            
        })
    }

    addDarkness(){
        this.darkCont = new PIXI.Container()
        this.darkness = new PIXI.Graphics()
        this.darkness.beginFill(0x000000, 0.5)
        this.darkness.drawRect(0,0, app.view.width, app.view.height)
        this.startScreen.addChild(this.darkness)
    }
    
    isEnd(){
        if (this.end ) {
            console.log('the end!')
            if (this.flowers.length == 0) {
                this.pony.changeTextureToWin()
                this.main.ticker.stop()
            } else {
                this.main.ticker.stop()
            }
            this.clear()
            this.init()
            this.addStartScreen()
        }
    }

    clear(){
        app.stage.removeChildren()
        this.flowers = []
        this.lemons = []


    }
    
    checkFlowersAmount() {
        if (this.flowers.length == 0) {
            this.end = true
        }
    }
    
    checkPonyCollision() {
        this.flowers.forEach(fl => {
            let isHit = this.pony.hits(fl)
            if (isHit) {
                this.end = true
            }
        })
    }
    
    createGradient() {
        let c = document.createElement("canvas");
        c.width = app.view.width;
        c.height = app.view.height;
        let ctx = c.getContext("2d");
    
        let grd = ctx.createLinearGradient(0, 0, app.view.width, 0);
        grd.addColorStop(0, 'red');
        grd.addColorStop(0.14, 'orange');
        grd.addColorStop(0.28, 'yellow');
        grd.addColorStop(0.42, 'green');
        grd.addColorStop(0.56, 'blue');
        grd.addColorStop(0.84, 'indigo');
        grd.addColorStop(1, 'purple');
    
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, app.view.width, app.view.height);
    
        let texture = new PIXI.Texture.fromCanvas(c)
        let sprite = new PIXI.Sprite(texture)
        this.bg.addChild(sprite)
        this.bg.x = 0
        this.bg.y = 0
    }
}