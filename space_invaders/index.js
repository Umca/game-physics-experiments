import Game from './game.js'

const app = new PIXI.Application(600, 650, { backgroundColor: 0x76787a })
document.body.appendChild(app.view)
window.app = app;

let game = new Game(app)
app.game = game

let assets = [
    { name: 'pony', url: 'img/pony.png' },
    { name: 'pony_win', url: 'img/pony_win.png' },
    { name: 'flower', url: 'img/flower.png' },
    { name: 'lemon', url: 'img/lemon.png' },
    { name: 'button', url: 'img/btn.png' },
] 

PIXI.loader
.add(assets)
.load(_ => {
    
        game.addElements()
        game.addStartScreen()
        
        //game.play()

    })




