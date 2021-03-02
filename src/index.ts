import * as PIXI from "pixi.js";

import "./style.css";
import View from "./view";
import Model from "./model";
import Controller from "./controller";
import { Transformer } from "./utils/transformer";
window.PIXI = PIXI;
window.onload = async (): Promise<void> => {
    const view = new View();
    const model = new Model();
    const controller = new Controller(view, model);
    // Init controller
    await controller.init();
    // Preset shapes
    const s0 = controller.createImage(new PIXI.Point(400, 200));
    // const s1 = controller.createShape(new PIXI.Point(400, 200));
    // const s2 = controller.createShape(new PIXI.Point(600, 200));
    const transformer = new Transformer({
        boxRotationEnabled: true,
        boxScalingEnabled: false,
        centeredScaling: false,
        group: [s0],
        rotateEnabled: true,
        scaleEnabled: true,
        skewEnabled: false,
        translateEnabled: true,
        transientGroupTilt: false,
        boxScalingTolerance: 0,
        boxRotationTolerance: 0,
    });
    view.viewport.addChild(transformer);
};
