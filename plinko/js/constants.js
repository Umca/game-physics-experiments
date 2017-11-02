const engine = Matter.Engine.create({
    render: {
        element: document.getElementById("debug"),
        options: {
            width: 500,
            height: 600,
            background: '#fafafa',
            wireframeBackground: '#222',
            hasBounds: false,
            enabled: true,
            wireframes: true,
            showSleeping: true,
            showDebug: true,
            showBroadphase: false,
            showBounds: false,
            showVelocity: false,
            showCollisions: false,
            showAxes: false,
            showPositions: true,
            showAngleIndicator: true,
            showIds: false,
            showShadows: true
        }
    }
})
const World = Matter.World
const world = engine.world
const Bodies = Matter.Bodies
const Engine = Matter.Engine
const Composites = Matter.Composites

const app = new PIXI.Application(500, 600, { backgroundColor: 0x76787a})
document.getElementById('wrapper').appendChild(app.view)

export { engine, Engine, World, world, Bodies, app, Composites }