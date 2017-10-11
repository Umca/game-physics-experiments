import { Box } from './box.js';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World;

// create an engine
var engine = Engine.create();

// create a renderer
var app = new PIXI.Application(800, 600, {
    backgroundColor: 0xFFFFFF
});
document.body.appendChild(app.view);

var boxes = []

// create two boxes and a ground
var boxA = new Box(400, 100, 50, 50, app, engine, 0);
var boxB = new Box(400, 200, 50, 50, app, engine, 0);
boxes.push(boxA, boxB);

//Matter.Body.setStatic(boxA.body, true);

let prev = null;

for (let i = 40; i < 220; i += 40){
    let box = new Box(i, 100, 20, 20, app, engine, !!!prev)
    boxes.push(box);
    debugger;
    if (prev) { 
        let constraint = Matter.Constraint.create({
            bodyA: prev.body,
            bodyB: box.body,
            length: 50,
            stiffness: 0.4
        })

        Matter.World.add(engine.world, constraint)
    }

    prev = box;
    
}

var groundBody = Matter.Bodies.rectangle(
    0,
    500,
    1500,
    50,
);
Matter.Body.setStatic(groundBody, true);
Matter.World.add(engine.world, groundBody);
var groundGr = new PIXI.Graphics();
groundGr.beginFill(0x1099bb);
groundGr.drawRect(0, 500, 1500, 50 );
app.stage.addChild(groundGr);
groundGr.pivot.x = groundGr.width / 2;
groundGr.pivot.y = groundGr.height / 2;
window.ground = {
    groundBody,
    groundGr
};
window.world = engine.world.bodies;


app.ticker.add(() => { 
    // run the engine
    Engine.update(engine);

    boxes.forEach(box => box.render())

});



