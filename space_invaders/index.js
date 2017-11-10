import Ship from './ship.js'
import Flower from './flower.js'
import Lemon from './lemon.js'


const app = new PIXI.Application(500, 600, { backgroundColor: 0x76787a })
document.body.appendChild(app.view)
window.app = app;
app.game = {}
app.game.keys$ = null
app.game.flowers = []
app.game.lemons = []
addListener()

let assets = [
    { name: 'pony', url: 'img/pony.png' },
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
            renderLemons()
            checkCollision()
            removeLemons()
        })

    })

function checkCollision() {
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
    app.game.ship = new Ship({
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
    let step = 100

    for (let i = 0; i < 7; i++){
        let flower = new Flower({
            container: app.stage,
            x: step * i,
            y: Math.floor(Math.random() * (60-35)) + 35
        })

        app.game.flowers.push(flower)
    }
}

function addLemon() {
    app.game.keys$
        .subscribe(next => {
            if (next.code === 'Space') {
                app.game.lemons.push(
                    new Lemon({
                        container: app.stage,
                        x: app.game.ship.x ,
                        y: app.game.ship.y - app.game.ship.height / 2, 
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


