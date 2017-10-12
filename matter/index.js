import { Box } from './box.js';

// module aliases
var Engine = Matter.Engine,
    World = Matter.World;

// create an engine
var engine = Engine.create();

// create a renderer
var app = new PIXI.Application(800, 600, {
    backgroundColor: 0x000000
});
document.body.appendChild(app.view);

PIXI.loader
    .add('light.png')
    .load(setup)

function setup() { 

    let points = [];
    
    let mesh = new PIXI.mesh.Plane(PIXI.loader.resources["light.png"].texture, 2, 150);
    mesh.x = 0;
    mesh.y = 0;
    app.stage.addChild(mesh);
 
    window.mesh = mesh;

    for (var y = 0; y <= 10; y++) {
        for (var x = 0; x <= 2; x++) {
            var point = new PIXI.Point(0 + x * 10, 0 + y * 10);

            points.push(point);

            let c = new PIXI.Graphics();
            c.beginFill(0xFFFFFF);
            c.drawCircle(0 + x * 30, 0 + y * 50, 1)
            app.stage.addChild(c);
        }
    }

    // for (let i = 0; i < mesh.vertices.length / 2; i += 2) { 
    //     let c = new PIXI.Graphics();
    //     c.beginFill(0xFFFFFF);
    //     c.drawCircle(mesh.vertices[i], mesh.vertices[i+1],3)
    //     app.stage.addChild(c);
    // }

    




    var boxes = []

    // create two boxes and a ground
    var boxA = new Box(600, 100, 50, 50, app, engine, 0);
    var boxB = new Box(600, 200, 50, 50, app, engine, 0);
    boxes.push(boxA, boxB);

    let chain = []
    let prev = null;

    for (let i = 240; i < 420; i += 40) {
        let box = new Box(i, 100, 20, 20, app, engine, !!!prev)
        chain.push(box);
        if (prev) {
            let constraint = Matter.Constraint.create({
                bodyA: prev.body,
                bodyB: box.body,
                length: 50,
                stiffness: 0.2
            })
            Matter.World.add(engine.world, constraint)
        }
        prev = box;
    }

    var groundBody = Matter.Bodies.rectangle(
        0,
        600,
        1500,
        50,
    );
    Matter.Body.setStatic(groundBody, true);
    Matter.World.add(engine.world, groundBody);
    var groundGr = new PIXI.Graphics();
    groundGr.beginFill(0x1099bb);
    groundGr.drawRect(0, 600, 1800, 50);
    app.stage.addChild(groundGr);
    groundGr.pivot.x = groundGr.width / 2;
    groundGr.pivot.y = groundGr.height / 2;

    let canvasMouse = Matter.Mouse.create(app.view);
    canvasMouse.pixelRatio = window.devicePixelRatio;

    let mouseC = Matter.MouseConstraint.create(engine, {
        mouse: canvasMouse
    })

    World.add(engine.world, mouseC);

    let lineContainer = new PIXI.Container();
    lineContainer.x = 0;
    lineContainer.y = 0;
    app.stage.addChild(lineContainer);

    let circleContainer = new PIXI.Container();
    lineContainer.x = 0;
    lineContainer.y = 0;
    app.stage.addChild(lineContainer);

    let circle = new PIXI.Graphics();
    circle.lineStyle(2, 0xFFFFFF);
    circle.drawCircle(0, 0, 20)
    app.stage.addChild(circle);

    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.on('pointermove', (e) => {
        circle.x = e.data.global.x;
        circle.y = e.data.global.y;
    });

    let count = 0;

    app.ticker.add(() => {
        // run the engine
        Engine.update(engine);

        lineContainer.removeChildren();

        boxes.forEach(box => box.render())
        chain.forEach(box => box.render())

        for (let i = 0; i < chain.length; i++) {
            if (i == chain.length - 1) break;

            let line = new PIXI.Graphics();
            line.lineStyle(2, 0xFFFFFF);
            lineContainer.addChild(line);

            line.moveTo(chain[i].body.position.x + chain[i].graphics.width / 2, chain[i].body.position.y + chain[i].graphics.height / 2)
            line.lineTo(chain[i + 1].body.position.x + chain[i + 1].graphics.width / 2, chain[i + 1].body.position.y + chain[i + 1].graphics.height / 2)

        }

        // count += 0.1;
        // for (var i = 5; i < points.length; i++) {
        //     points[i].y = Math.sin((i * 0.5) + count);
        //     points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 10 ;
        // }

    });
}





