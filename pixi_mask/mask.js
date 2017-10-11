var app = new PIXI.Application(800, 700, {backgroundColor: 0xFF9933} );
document.body.appendChild(app.view);
window.app = app;

var container = new PIXI.Container();
app.container = container;
container.x = 0;
container.y = 0;
app.stage.addChild(container);
container.x = 800 / 2
container.y = 700 / 2;

PIXI.loader
.add('path.png')
.load((resources) => {
    function Circle(x, y, color = 0xEE0033){
        var graphics = new PIXI.Graphics();
        graphics.alpha = 1;
        graphics.beginFill(color);
        graphics.drawCircle(x, y, 5); // drawCircle(x, y, radius)
        graphics.endFill();
        container.addChild(graphics);
        return graphics;
    }

    function generator(arr){
        arr.forEach( ({x, y}, i) => {
            Circle(x,y);
        })
    }


    var texture = PIXI.loader.resources['path.png'].texture;
    var path = new PIXI.Sprite(texture);
    path.x = -400;
    path.y = -300;
    this.container.path = path;    
    container.addChild(path);
    path.alpha = 0;

    


    let control_points = [
        {x: 320 , y: 330}, {x: 301, y:262 },
        {x: 221 , y: 208 }, {x: 140 , y:175 }, {x: 70, y: 40},
        {x:20 , y: -84}, 
        {x:-120 , y:-234}, {x: -254 , y:-264 }, {x: -325 , y: -254}
    ];

    let boat = new PIXI.Graphics();
    boat.beginFill(0x66CCFF);
    boat.drawRect(0, 0, 20, 20);
    boat.endFill();
    boat.x = 320;
    boat.y = 330;
    boat.pivot.x = 20 / 2;
    boat.pivot.y = 20 / 2;
    container.addChild(boat);
    container.boat = boat;

    //generator(control_points);

    let data = [];
    let counter = 0;

    let polygon = new PIXI.Graphics();
    container.polygon = polygon;
    container.addChild(polygon);

    // path.mask = polygon;
   
    let coords = [];

    new TweenMax(boat, 6, {
        bezier:{
          type:"soft", 
          values:control_points,
          autoRotate: ["x","y","rotation",90*Math.PI/180,true]
        },
        onStart: () => {
            

            let f_r_x = boat.x + 50 * Math.sin(Math.PI/2 - boat.rotation)
            let f_r_y = boat.y + 50 * Math.cos(Math.PI/2 - boat.rotation)
            let f_l_x = boat.x + 50 * Math.sin(Math.PI/2 - boat.rotation)
            let f_l_y = boat.y + 50 * Math.cos(Math.PI/2 - boat.rotation)
            data.push({
                left:{
                    x: f_l_x,
                    y: f_l_y
                },
                right:{
                    x: f_r_x,
                    y: f_r_y
                }
            });


            data.forEach(coord => {
                coords.push(coord.left.x, coord.left.y)
            })
            
            for(let i = data.length -1; i > 0; i-- ){
                coords.push(data[i].right.x, data[i].right.y)
            }
            //polygon.drawPolygon(coords);
            //polygon.closePath();
        },
        onUpdate:() => {
            if(counter == 10){
                path.alpha =1
                polygon.clear();
                // polygon.beginFill(0xffffff);
                // polygon.lineStyle(2, 0x000000, 1);
                counter = 0;
                //Circle(boat.x, boat.y );

                let r_x, r_y;
                r_x = boat.x + 50 * Math.sin(Math.PI/2 - boat.rotation)
                r_y = boat.y + 50 * Math.cos(Math.PI/2 - boat.rotation)
                Circle(r_x, r_y, 0x66CCFF)

                let l_x, l_y;
                l_x = boat.x - 50 * Math.sin(Math.PI/2 - boat.rotation)
                l_y = boat.y - 50 * Math.cos(Math.PI/2 - boat.rotation)
                Circle(l_x, l_y, 0x66CCFF)

                data.push({
                    left:{
                        x: l_x,
                        y: l_y
                    },
                    right:{
                        x: r_x,
                        y: r_y
                    }
                });


                data.forEach(coord => {
                    coords.push(coord.left.x, coord.left.y)
                    
                })
                
                for(let i = data.length -1; i > 0; i-- ){
                    coords.push(data[i].right.x, data[i].right.y)
                }

                
                path.mask = polygon;
                // polygon.beginFill(0xffffff, 0);
                polygon.lineStyle(50, 0x000000, 1);

                polygon.drawPolygon(coords);
                // polygon.endFill()
                polygon.closePath();
 
            }
            counter++;
        },
        ease:Linear.easeNone});

        
    
});



