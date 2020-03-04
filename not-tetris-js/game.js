const BLOCK_SIZE = 40;

let game;
window.onload = function () {
    let config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.NONE,
            parent: "gameDiv",
            width: 640,
            height: 480
        },
        scene: playGame,
        physics: {
        default:
            "matter",
            matter: {
                gravity: {
                    y: 1
                },
                debug: true, // draws outlines and centers, TODO: proper graphics
            }
        }
    }
    game = new Phaser.Game(config);
    window.focus();
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        this.matter.world.update30Hz();
        this.matter.world.setBounds(BLOCK_SIZE, -BLOCK_SIZE*4, game.config.width - BLOCK_SIZE*2, game.config.height + 3*BLOCK_SIZE);
        this.matter.add.rectangle(game.config.width / 2 - BLOCK_SIZE / 2, game.config.height / 2, BLOCK_SIZE, BLOCK_SIZE * 4);
        this.input.on("pointerup", this.sliceRow, this);
    }
    sliceRow(pointer) {
        let y = 400;
        
        let bodies = this.matter.world.localWorld.bodies;
        let toBeSliced = [];
        let toBeCreated = [];
        for (let i = 0; i < bodies.length; i++) {
            let vertices = bodies[i].parts[0].vertices;
            let pointsArray = [];
            vertices.forEach(vertex => {
                pointsArray.push(vertex.x, vertex.y)
            });
            let slicedPolygons = PolyK.Slice(pointsArray, BLOCK_SIZE, y, game.config.width - BLOCK_SIZE*2, y);
            if (slicedPolygons.length > 1) {
                toBeSliced.push(bodies[i]);
                slicedPolygons.forEach(points => {
                    toBeCreated.push(points)
                })

            }
        }
        toBeSliced.forEach((body => {
                this.matter.world.remove(body)
            }).bind(this));
        toBeCreated.forEach((points => {
                let polyObject = [];
                for (let i = 0; i < points.length / 2; i++) {
                    polyObject.push({
                        x: points[i * 2],
                        y: points[i * 2 + 1]
                    })
                }
                let sliceCentre = Phaser.Physics.Matter.Matter.Vertices.centre(polyObject)
                    let slicedBody = this.matter.add.fromVertices(sliceCentre.x, sliceCentre.y, polyObject, {
                        isStatic: false
                    });
            }).bind(this));
    }
};
