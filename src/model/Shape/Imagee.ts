import * as PIXI from "pixi.js";
import { v4 } from "uuid";
export interface ImageeOptions {
    id?;
    pos?;
    width?;
    height?;
}
export class Imagee extends PIXI.Sprite {
    id;
    pid;
    constructor(options: ImageeOptions) {
        const { id, width, height, pos } = options;
        super(PIXI.Texture.from("https://source.unsplash.com/random"));
        this.id = id || v4();
        this.width = width;
        this.height = height;
        this.position = new PIXI.Point(pos.x + this.width / 2, pos.y + this.height / 2);
        this.pivot = new PIXI.Point(pos.x + this.width / 2, pos.y + this.height / 2);
        this.interactive = true;
    }
}
