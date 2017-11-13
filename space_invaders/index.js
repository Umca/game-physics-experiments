import Pony from './ship.js'
import Flower from './flower.js'
import Lemon from './lemon.js'


const app = new PIXI.Application(600, 650, { backgroundColor: 0x76787a })
document.body.appendChild(app.view)
window.app = app;
app.game = {}
app.game.keys$ = null
app.game.flowers = []
app.game.lemons = []
app.game.edge = false
app.game.end = false
app.game.button = null

app.game.bg = new PIXI.Container()
app.stage.addChild(app.game.bg)
app.game.bg.x = 0
app.game.bg.y = 0

addListener()
createGradient()

let assets = [
    { name: 'pony', url: 'img/pony.png' },
    { name: 'pony_win', url: 'img/pony_win.png' },
    { name: 'flower', url: 'img/flower.png' },
    { name: 'lemon', url: 'img/lemon.png' },
] 

PIXI.loader
    .add(assets)
    .load(_ => {

        addPony()
        addFlowers()
        addLemon()
        
            
        app.ticker.add(_ => {
            isEnd()
            removeFlowers()
            moveFlowers()
            renderLemons()
            checkCollision()
            checkFlowersAmount()
            removeLemons()
        })

    })

function checkCollision() {
    checkLemonCollision()
    checkPonyCollision()
}

function checkLemonCollision() {
    app.game.lemons.forEach(lemon => {
        app.game.flowers.forEach(flower => {
            if (lemon.hits(flower)) {
                lemon.toDelete = true
                flower.rotate()
            }
        })
    })
}

function addPony() {
    app.game.pony = new Pony({
        container: app.stage,
        x: app.view.width,
        y: app.view.height
    })
}

function renderLemons() {
    app.game.lemons.forEach(lemon => lemon.fly())
}

function addListener() {
    app.game.keys$ = Rx.Observable.fromEvent(document, 'keydown')
}

function addFlowers() {
    let step = 93

    for (let k = 1; k < 3; k++){
        for (let i = 0; i < 5; i++) {
            let flower = new Flower({
                container: app.stage,
                x: step * i,
                y: (Math.floor(Math.random() * (60 - 35)) + 45) * k
            })

            app.game.flowers.push(flower)
        }
    }
    
}

function addLemon() {
    app.game.keys$
        .subscribe(next => {
            if (next.code === 'Space') {
                app.game.lemons.push(
                    new Lemon({
                        container: app.stage,
                        x: app.game.pony.x ,
                        y: app.game.pony.y - app.game.pony.height / 2, 
                   })
               )
            }
        })
}

function removeLemons() {
    app.game.lemons.forEach((lemon, i, lemons) => {
        if (lemon.toDelete) {
            lemon.remove()
            lemons.splice(i, 1)
            i--
        }
    })
}

function removeFlowers() {
    app.game.flowers.forEach((fl, i, flowers) => {
        if (fl.toDelete) {
            flowers.splice(i, 1)
            i--
        }
    })
}

function moveFlowers() {
    app.game.flowers.forEach( (flower, i, flowers) => {
        flower.move()
        if (flower.reachEdge()) {
            app.game.edge = true 
        }
        if (app.game.edge) {
            flowers.forEach(fl => fl.shiftDown())
            
        }
    })
}

function addBtn() {
    
}

function isEnd(){
    if (app.game.end ) {
        console.log('the end!')
        if (app.game.flowers.length == 0) {
            app.game.pony.changeTextureToWin()
            app.ticker.stop()
        }
    }
}

function checkFlowersAmount() {
    if (app.game.flowers.length == 0) {
        app.game.end = true
    }
}

function checkPonyCollision() {
    app.game.flowers.forEach(fl => {
        let isHit = app.game.pony.hits(fl)
        if (isHit) {
            app.game.end = true
        }
    })
}

function createGradient() {
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
    app.game.bg.addChild(sprite)
    app.game.bg.x = 0
    app.game.bg.y = 0
}


