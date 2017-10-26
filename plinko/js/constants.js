const engine = Matter.Engine.create()
const World = Matter.World
const world = engine.world
const Bodies = Matter.Bodies
const Engine = Matter.Engine
const Composites = Matter.Composites

const app = new PIXI.Application(500, 600, { backgroundColor: 0x000000 })
document.body.appendChild(app.view)

export { engine, Engine, World, world, Bodies, app, Composites }