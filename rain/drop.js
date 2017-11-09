export class Drop extends PIXI.Sprite{

    static createTexture(renderer){
        let drop = new PIXI.Graphics()
        drop.beginFill(0x5b2d89)
        drop.drawRect(0,0,1,10)

        let t = renderer.generateTexture(drop)
        return t
    }
    constructor(parent, renderer){
        super(Drop.createTexture(renderer))
        this.x = this.random(0, 500)
        this.y = this.random(-500, -50)
        this.z = this.random(0, 20)
        this.yspeed = this.map(this.z, 0, 20, 4, 10)
        this.length = this.map(this.z, 0, 20, 10, 20)
        this.parent = parent
        this.renderer = renderer

        //this.rotation = 0.5

        this.parent.addChild(this)
    }

    fall(){
        this.y = this.y + this.yspeed
        this.yspeed = this.yspeed + 0.1 
        this.checkYPosition()
    }

    checkYPosition(){
        if( this.y > 600){
            this.y = this.random(-100, -200)
            this.yspeed = this.random(4, 8)
        }
    }

    makeGraphic(){
        let drop = new PIXI.Graphics()
        drop.beginFill(0x5b2d89)
        drop.drawRect(0,0,w,10)
        return drop
    }

    random(min, max){
        return Math.floor(Math.random() * (max - min) + min)
    }

    map(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
    }
}