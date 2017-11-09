import {Drop} from './drop.js'

const app = new PIXI.Application(500, 600, { backgroundColor: 0x76787a})
document.body.appendChild(app.view)
const particleContainer = new PIXI.particles.ParticleContainer(500, {scale: true, position: true, rotation: true})
app.stage.addChild(particleContainer)

let drops = []
let amount = 1

window.app = app;
window.drops = drops;

for (let i = 0; i < amount; i++){
     let drop = new Drop(particleContainer, app.renderer)
     drops.push(drop)
}

// app.ticker.add( _ => {

//     drops.forEach( drop => {
//         drop.fall()
//         console.log(drop.x)
//         debugger
//     })

// })