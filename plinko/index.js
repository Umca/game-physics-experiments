import { engine, Engine, World, world, app, Composites } from './js/constants.js'
import { Particle } from './js/particle.js'
import { Boundary } from './js/boundary.js'

window.app = app

let particles = []
let plinkos = []

world.gravity.y = 1.5

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
            plinkos.push(new Particle(x, y, 4, { isStatic: true }))
        }
    }

    //addSeparators(cols, spacing)
}

let boundary;

function addBoundary() {
    console.log(app.view.width)
    boundary = new Boundary(0, 500, app.view.width, 50)
    // let leftBoundary = new Boundary(225, 200, 50, app.view.height)
    //let rightBoundary = new Boundary(300, 50, 50, app.view.height)
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

let frameCount = 0 

addBoundary()
//addPlinkos()


app.ticker.add( _ => { 
    Engine.update(engine)
    if (frameCount % 60 == 0) {
        let start = randomStart()
        particles.push(new Particle(start, 0, 10, {isStatic: false, restitution: 0.8, friction: 0}))
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