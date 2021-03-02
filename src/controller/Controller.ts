import * as PIXI from "pixi.js";
import View from "../view";
import Model from "../model";
import keyboardJS from "keyboardjs";
import { Shape } from "../model/Shape/Shape";
import { Transformer } from "../utils/transformer";
export default class Controller {
    static isExists = false;
    static instance: Controller;
    view!: View;
    model!: Model;
    isShift = false;
    constructor(view, model) {
        if (Controller.isExists) return Controller.instance;

        Controller.instance = this;
        Controller.isExists = true;
        this.view = view;
        this.model = model;
        keyboardJS.bind(
            "shift",
            () => {
                this.isShift = true;
            },
            () => {
                this.isShift = false;
            }
        );
        keyboardJS.bind("ctrl + g", () => {
            // this.shapeList.forEach(_ => {
            //     if (_.transformer.visible) {
            //
            //     }
            // })
        });
    }

    // Handlers

    handleCanvasClick(e: PIXI.InteractionEvent) {
        e.stopPropagation();
        this.view.viewport.children
            .filter((_) => _.name === "transformer")
            .forEach((_) => {
                _.visible = false;
            });
    }

    addListeners() {
        const canvas = this.view.getCanvasElement();

        canvas.on("pointerdown", (e) => this.handleCanvasClick(e));
    }

    // Main logic

    // init  values
    initValues() {}

    createShape(pos = new PIXI.Point(0, 0)) {
        const shape = this.model.getRandomShape(pos, this.view.stage);
        // Render new shapes
        this.view.renderShapes([shape]);
        shape.on("pointerdown", (event) => {
            event.stopPropagation();
            const target = event.target;
            const transformer = this.view.viewport.children.find((_) => target.pid === (_ as Transformer).id);
            if (transformer) transformer.visible = true;
        });
        return shape;
    }

    createImage(pos = new PIXI.Point(0, 0)) {
        const image = this.model.createImage({ pos, width: 100, height: 100 });
        this.view.renderImages([image]);
        image.on("pointerdown", (event) => {
            event.stopPropagation();
            const target = event.target;
            const transformer = this.view.viewport.children.find((_) => target.pid === (_ as Transformer).id);
            if (transformer) transformer.visible = true;
        });
        return image;
    }

    // init Controller
    async init() {
        this.initValues();
        await this.view.init();
        this.addListeners();
    }
}
