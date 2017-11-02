import { engine, Engine, World, world, app, Composites } from './js/constants.js'
import { Particle } from './js/particle.js'
import { Boundary } from './js/boundary.js'

window.app = app
world.gravity.y = 1.5

let frameCount = 0 
let particles = []
let plinkos = []
let maxCount = 30

function findPlinko(id){
    return plinkos.filter(plinko => plinko.body.id == id && plinko.body.label == 'Plinko')
}

function addPlinkos() { 
    let rows = 20
    let cols = 10
    let spacing = app.view.width  / cols

    for (let i = 0; i < cols; i++){
        for (let k = 0; k < rows; k++){
            let x, y
            if (i % 2 == 1) {
                x = k * spacing + spacing /2
            } else {
                x = k * spacing
            }
            y = i * spacing  + spacing
            let plinko = new Particle(x, y, 4, { isStatic: true })
            plinko.body.label = 'Plinko'
            plinkos.push(plinko)
        }
    }
}

function addBoundary() {
    let boundary = new Boundary(250, 625, app.view.width, 50)
}

function addSeparators(cols, spacing) {
    for (let i = 0; i < cols; i++) { 
        let x = spacing * i; 
        let y = 580;
        let w = 10;
        let h = 100;
        let b = new Boundary(x, y, w, h);
    }
}

function randomStart() {
    return Math.round(Math.random() * (app.view.width-200) + 100)
}


addBoundary()
addPlinkos()
addSeparators(12, 45)

Matter.Events.on(engine, 'collisionStart', (e) => {
    e.pairs.forEach( pair => {
        let pl = findPlinko(pair.bodyA.id)[0]
        if(pl){
            pl.graph.tint = Math.random() * 0xFFFFFF
            setTimeout(_ => {
                pl.graph.tint = 0xFFFFFF
            }, 100)
        }
        
    })

}) 

Engine.run(engine)

app.ticker.add( _ => { 

    if (frameCount % 60 == 0 && maxCount > 0) {
        let start = randomStart()
        particles.push(new Particle(start, 0, 10, {isStatic: false, restitution: 0.8, friction: 0}, true))
        maxCount--
    }

    

    frameCount++

    particles.forEach( (p, i, arr) => {
        p.render()
        if (p.isOffScreen()) {
            app.stage.removeChild(p)
            Matter.Composite.remove(world, p)
            arr.splice(i, 1)
            i--
        }
    })

})