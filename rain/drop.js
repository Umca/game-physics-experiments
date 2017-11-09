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
        this.x = this.random(0, 600)
        this.y = this.random(-500, -50)
        this.z = this.random(0, 20)
        this.yspeed = this.map(this.z, 0, 20, 4, 10)
        this.length = this.map(this.z, 0, 20, 10, 20)
        this.width = this.map(this.z , 0, 20, 1, 3)
        this.parent = parent
        this.renderer = renderer

        this.rotation = 0.3

        this.parent.addChild(this)
        this.changePosition()
    }
    changePosition() {
        if (this.rotation !== 0) {
            this.x = this.random(0, 600)
        }
    }

    fall(){
        this.y = this.y + this.yspeed

        if (this.rotation !== 0) {
            if (this.rotation < 0) {
                this.x = this.x + Math.sin(this.rotation) * this.height
            } else {
                this.x = this.x - Math.sin(this.rotation) * this.height
            }
        }
        this.yspeed = this.yspeed + 0.1 
        this.checkYPosition()

    }

    checkYPosition(){
        if( this.y > 600 ){
            this.x = this.random(0, 600)
            this.y = this.random(-500, -50)
            this.yspeed = this.random(4, 8)
        }
        if (this.rotation !== 0) {
            this.changePosition()
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