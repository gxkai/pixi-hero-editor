import { Circle, Ellipse, Polygon, Rectangle } from "./Shape/Shape";
import { CommonUtils } from "../utils/Util";
import { Imagee, ImageeOptions } from "./Shape/Imagee";

export default class Model {
    private static isExists: boolean;
    private static instance: any;
    state;
    constructor() {
        if (Model.isExists) return Model.instance;

        Model.instance = this;
        Model.isExists = true;
        this.state = {
            gravity: 10,
            radius: 50,
            shapesArea: 0,
            shapesPerSecond: 5,
            shapesQuantity: 0,
            timeDelay: 1000,
        };
    }

    // Get random shape: circle, ellipse, polygon
    getRandomShape(pos, stage) {
        const array = [this.createCircle, this.createEllipse, this.createPolygon, this.createRectangle];

        const randomInt = CommonUtils.getRandomInt(0, array.length - 1);
        const shape = array[randomInt];

        // return shape(pos, stage);
        return this.createRectangle(pos, stage);
    }

    createCircle = (pos, stage) => {
        const { radius } = this.state;
        const circle = new Circle({
            pos: {
                x: pos.x,
                y: pos.y,
            },
            radius,
            strokeWidth: 3,
            strokeColor: 0x000000,
            alpha: 0.6,
            stage,
        });

        return circle.draw();
    };

    createEllipse = (pos, stage) => {
        const { radius } = this.state;
        const ellipse = new Ellipse({
            pos: {
                x: pos.x,
                y: pos.y,
            },
            radius,
            strokeWidth: 3,
            strokeColor: 0x000000,
            alpha: 0.6,
            stage,
        });

        return ellipse.draw();
    };

    createPolygon = (pos, stage) => {
        const { radius } = this.state;
        const polygon = new Polygon({
            pos: {
                x: pos.x,
                y: pos.y,
            },
            radius,
            strokeWidth: 3,
            strokeColor: 0x000000,
            alpha: 0.6,
            stage,
        });

        return polygon.draw();
    };

    createRectangle = (pos, stage) => {
        const { radius } = this.state;
        const rectangle = new Rectangle({
            pos: {
                x: pos.x,
                y: pos.y,
            },
            radius,
            strokeWidth: 3,
            strokeColor: 0x000000,
            alpha: 0.6,
            stage,
        });

        return rectangle.draw();
    };

    createImage = (params: ImageeOptions) => {
        return new Imagee(params);
    };
}
