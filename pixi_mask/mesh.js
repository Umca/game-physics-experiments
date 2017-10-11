var app = new PIXI.Application(800, 700 );
document.body.appendChild(app.view);
window.app = app;
let canvas = document.querySelector('canvas');

PIXI.loader
    .add('pion.jpg')
    .load((resources) => {

    let mouse = {
        x:0,
        y:0,
        px:0,
        py:0
    },
    pointsX = 40,
    pointsY = 40,
    brushSize =20,
    isDown = false;
    

    var texture = PIXI.loader.resources['pion.jpg'].texture;
    let mesh = new PIXI.mesh.Plane(texture, pointsX, pointsY);
    app.stage.addChild(mesh);
    mesh.x = app.view.width / 2 - mesh.width /2;
    mesh.y = app.view.height / 2 - mesh.height /2;
    window.mesh = mesh;

    let spacingX = mesh.width / pointsX;
    let spacingY = mesh.height / pointsY;

    class Point{
        constructor(x, y){
            this.x = this.origX =x;
            this.y = this.origY =y;

            this.randomize(this.reset.bind(this))
        }
        update(delta){
            if(isDown){
                let dx, dy, dist;
                    dx = this.x - mouse.x + mesh.x; 
                    dy = this.y - mouse.y + mesh.y;
                    dist = Math.sqrt(dx*dx +dy*dy)
                
                    if(dist < brushSize){
                        // this.x = this.x + (mouse.x- mouse.px) * Math.random()
                        // this.y = this.y + (mouse.y- mouse.py) * Math.random()
                        this.x = this.x + (mouse.x - mouse.px) * Math.abs(Math.cos(Math.PI * 2 * dx / dist));
                        this.y = this.y + (mouse.y - mouse.py) * Math.abs(Math.cos(Math.PI * 2  * dy / dist));
                    }
            }
            return this;
        }

        randomize(cb){
            let nx = this.x + (Math.random() * 60)
            let ny = this.y + (Math.random() * 60)

            this.animateTo(nx, ny, null, cb ? cb : null)
        }

        animateTo(nx, ny, force, cb){
            if(!this.resetting||force){
                var dx = nx - this.x;
                var dy = ny - this.y;
                var dist = Math.sqrt(dx *dx + dy*dy)
                this.resetting = true;

                TweenMax.to(this, Math.min(1.25, Math.max(0.4, dist/40)), {
                    x: nx,
                    y: ny,
                    ease: Elastic.easeOut.config(1.2, 0.4),
                    onComplete: () => {
                        this.resetting = false;
                        if(cb){
                            cb();
                        }
                    }
                })
            } else if(cb){
                cb();
            }
        }

        reset(){
            this.animateTo(this.origX, this.origY, true)
        }
    }

    
    class Cloth {
        constructor(){
            this.points = [];
            this.fillInPoints();
        }
        fillInPoints(){
            for(let y = 0 ; y < pointsY; y++){
                for (let x = 0 ; x < pointsX; x++){
                    this.points.push( new Point(0 + x * spacingX, 
                        0 + y * spacingY))
                    let circle = new PIXI.Graphics();
                    circle.beginFill(0x9966FF);
                    circle.drawCircle(0 + x * spacingX, 0 + y * spacingY, 1);
                    circle.endFill();
                    app.stage.addChild(circle);
                }
            }
        }
        update(delta){
            this.points.forEach( (point, i) => {
                point.update(delta * delta);
                i *= 2;
                mesh.vertices[i] = point.x;
                mesh.vertices[i + 1] = point.y;
            });
        }

        randomize(cb){
            this.points.forEach((point, i)=>{
                point.randomize(i==0 ? cb : null)
            })
        }

        reset(){
            this.points.forEach(point=>{
                point.reset();
            })
        }
    }

    const cloth = new Cloth();
    
    let brush = new PIXI.Graphics();
    brush.lineStyle(1, 0xFFFFFF, 1);
    brush.drawCircle(mouse.x, mouse.y, brushSize);
    brush.x = mouse.x;
    brush.y = mouse.y;
    app.stage.addChild(brush);

    function updateBrush(){
        brush.x = mouse.x;
        brush.y = mouse.y;
    }

    function handleMouseMove(e){
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    function handleMouseDown(e){
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        isDown = true;
    }
    function handleMouseUp(e){
        isDown = false
    }

    app.ticker.add(()=>{
        updateBrush();
        cloth.update(0.016);
    })

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)

});





































//     app.ticker.add(()=>{
//         updateBrush();
//         // //checkCollission(ev);
//         // //if(a.x.length > 0 || a.y.length > 0) {
//         // if((a.x || a.y) && isDown && isMoving) {
//         //     console.log(a);
//         //     debugger;
//         //     // mesh.vertices[a.x] = ev.clientX - mesh.toGlobal({x:0,y:0}).x - offset.x;
//         //     // mesh.vertices[a.y] = ev.clientY - mesh.toGlobal({x:0,y:0}).x - offset.y;
//         //     // a.x.forEach( i => mesh.vertices[i] = ev.clientX - mesh.toGlobal({x:0,y:0}).x - offset.x); 
//         //     // a.y.forEach( i => mesh.vertices[i] = ev.clientY - mesh.toGlobal({x:0,y:0}).y - offset.y); 
//         //     a.x.forEach( i => mesh.vertices[i] += diff_x); 
//         //     a.y.forEach( i => mesh.vertices[i] += diff_y); 
//         // }
       
//     })

//     // let a = {x:[], y:[]};
//     // //let a = {}
//     // function checkCollision(e){
       
//     //     // let mouseStartX = e.clientX - mesh.toGlobal({x:0,y:0}).x - offset.x-mouse.width /2 -1;
//     //     // let mouseStartY = e.clientY - mesh.toGlobal({x:0,y:0}).y - offset.y-mouse.height /2 -1;
//     //     let mouseStartX = e.clientX - app.view.width * 0.5 - mouse.width * 0.5;
//     //     let mouseStartY = e.clientY - app.view.height * 0.5 - mouse.height * 0.5;
//     //     let mouseEndX = mouseStartX + mouse.width;
//     //     let mouseEndY = mouseStartY + mouse.height;

//     //     for(let i = 0; i <= mesh.vertices.length; i+=2){
//     //         if(mouseStartX < mesh.vertices[i] - mesh.width * 0.5 
//     //         && mesh.vertices[i] - mesh.width * 0.5 < mouseEndX 
//     //         && mouseStartY < mesh.vertices[i+1] - mesh.height * 0.5 
//     //         && mesh.vertices[i+1] - mesh.height * 0.5 < mouseEndY){
//     //             a.x.push(i)
//     //             a.y.push(i+1)
//     //             // a.x = i;
//     //             // a.y = i+1;
//     //         }
//     //     }
//     // }
    

    
//     document.querySelector('canvas').addEventListener('mousemove', (e)=> {
//         isMoving = true;
//         mouse.x = e.clientX;
//         mouse.y = e.clientY;
//         console.log(mouse.x, brush.x)
    
//         // mouse.x = e.clientX - 800 / 2 - offset.x - mouse.width/2 +1;
//         // mouse.y = e.clientY - 700 / 2 - offset.y - mouse.height/2+1;

//         // diff_x = mouse.x - m_startX;
//         // diff_y = mouse.y - m_startY;

//         // m_startX = mouse.x;
//         // m_startY = mouse.y;
        
//         // ev = e;
//         console.log('move');
 
//     })

// });


























    // document.querySelector('canvas').addEventListener('mousedown', (e)=> {
    //     a = {x:[], y:[]};
    //     isDown = true;
    //     isMoving = false;
    //     m_startX = e.clientX - 800 / 2 - offset.x - mouse.width/2 +1;;
    //     m_startY = e.clientY - 700 / 2 - offset.y - mouse.height/2+1;;
    //     //v = e;
    //     checkCollision(ev);
    //     console.log('down', m_startX, m_startY)
    // })
    // document.querySelector('canvas').addEventListener('mouseup', (e)=> {
    //     a = {x:[], y:[]};
    //     isDown = false;
    //     isMoving = false;
    // })

    
    
    // for(let i = 0 ; i < mesh.vertices.length ; i+=2){
    //     let net = new PIXI.Graphics();
    //     net.lineStyle(1, 0xFFFF, 1);
    //     net.drawRect(mesh.vertices[i] - 162, mesh.vertices[i+1]-162,14,14);
    //     app.stage.addChild(net);
    // }

    

    // document.querySelector('canvas').addEventListener('mousemove', (e)=> {
    //     mouse.x = e.clientX - 800 / 2 - offset.x - mouse.width/2 +1;
    //     mouse.y = e.clientY - 700 / 2 - offset.y - mouse.height/2+1;
    //     ev = e;  

    //     if(a.x || a.y) {
    //         mesh.vertices[a.x] = ev.clientX - mesh.toGlobal({x:0,y:0}).x - offset.x;
    //         mesh.vertices[a.y] = ev.clientY - mesh.toGlobal({x:0,y:0}).x - offset.y;
    //     }
    // })
    // document.querySelector('canvas').addEventListener('mousedown', (e)=> {
    //     console.log('down')
    //     checkCollission(e);
    // })
    // document.querySelector('canvas').addEventListener('mouseup', (e)=> {
    //     console.log('up')
    //     a = {};
    // })







