import * as PIXI from "pixi.js";
import { CommonUtils } from "../../utils/Util";
import { v4 } from "uuid";
export class Shape extends PIXI.Graphics {
    fillColor: number;
    pos: PIXI.Point;
    radius: number;
    strokeWidth: number;
    strokeColor: number;
    alpha: number;
    area = 0;
    id;
    pid;
    constructor({ pos, radius, strokeWidth, strokeColor, alpha, stage, id }) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.fillColor = CommonUtils.getRandomColor();
        this.pos = pos;
        this.radius = radius;
        this.strokeWidth = strokeWidth || 1;
        this.strokeColor = strokeColor || 0x000000;
        this.alpha = alpha || 1;
        this.id = id || v4();
    }
}

export class Circle extends Shape {
    constructor(options) {
        super(options);
    }

    draw() {
        this.area = Math.PI * (this.radius * this.radius);
        this.beginFill(this.fillColor);
        this.lineStyle(this.strokeWidth, this.strokeColor, this.alpha);
        this.drawCircle(this.pos.x, this.pos.y, this.radius);
        this.endFill();

        return this;
    }
}

export class Ellipse extends Shape {
    constructor(options) {
        super(options);
    }

    draw() {
        this.area = Math.PI * ((this.radius * this.radius) / 2);
        this.beginFill(this.fillColor);
        this.lineStyle(this.strokeWidth, this.strokeColor, this.alpha);
        this.drawEllipse(this.pos.x, this.pos.y, this.radius, this.radius / 2);
        this.endFill();

        return this;
    }
}

export class Rectangle extends Shape {
    constructor(options) {
        super(options);
    }
    draw(
        width = this.radius,
        height = this.radius,
        pos = this.pos,
        rotation = this.rotation,
        position = new PIXI.Point(pos.x + width / 2, pos.y + height / 2),
        pivot = new PIXI.Point(pos.x + width / 2, pos.y + height / 2)
    ) {
        this.clear();
        this.lineStyle(0, 0xffff66, 0.5);
        this.beginFill(0xffff66, 0.5);
        this.drawRect(pos.x, pos.y, width, height);
        // This defines the center.
        this.position = position;
        // This says to pivot around the center.
        this.pivot = pivot;
        this.rotation = rotation;
        return this;
    }
}

export class Polygon extends Shape {
    sides: number;
    paths: number[];
    constructor(options) {
        super(options);

        this.sides = options.sides || CommonUtils.getRandomInt(3, 6);
        this.paths = this._getPaths(this.sides);
        this.name = this._getShapeType(this.sides);
    }

    _getPaths(sidesQuantity) {
        const paths: number[] = [];

        for (let i = 0; i < sidesQuantity; i++) {
            const x = this.pos.x + this.radius * Math.cos(3 + (2 * Math.PI * i) / this.sides);
            const y = this.pos.y + this.radius * Math.sin(3 + (2 * Math.PI * i) / this.sides);

            paths.push(x, y);
        }

        return paths;
    }

    _getShapeType(sidesQuantity) {
        const types = {
            3: "triangle",
            4: "quadrangle",
            5: "pentagon",
            6: "hexagon",
        };

        return types[sidesQuantity];
    }

    draw() {
        this.area = CommonUtils.getPolygonArea(this.paths);
        this.beginFill(this.fillColor);
        this.lineStyle(this.strokeWidth, this.strokeColor, this.alpha);
        this.drawPolygon(this.paths);
        this.endFill();

        return this;
    }
}
