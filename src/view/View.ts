import { Viewport } from "pixi-viewport";
import { Application, Rectangle } from "pixi.js";
import { Shape, Rectangle as Rect } from "../model/Shape/Shape";
import { CommonUtils } from "../utils/Util";
import { GraphPaper, GraphPaperStyle } from "pixi-graphpaper";
import { Imagee } from "../model/Shape/Imagee";

export default class View extends Application {
    static isExists = false;
    static instance: View;
    _width;
    _height;
    viewport;
    constructor() {
        super({
            view: CommonUtils.getElementById("pixi") as HTMLCanvasElement,
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio,
            backgroundColor: 0xabcdef,
            antialias: true,
        });
        if (View.isExists) return View.instance;

        View.instance = this;
        View.isExists = true;
        this.initDimensions();
    }

    // Init stage
    async init() {
        await CommonUtils.loadGameAssets();
        this.stage.hitArea = new Rectangle(0, 0, this.screen.width, this.screen.height);
        this.stage.interactive = true;
        this.stage.buttonMode = true;
        this.stage.sortableChildren = true;
        // this.renderer.resize(this._width, this._height);
        // this.initBackground();
        const viewport = this.initViewport();
        this.viewport = viewport;
        this.initBackground(viewport);
        // this.initGraphPaper(viewport);
    }

    initViewport() {
        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            interaction: this.renderer.plugins.interaction,
        })
            .drag()
            .pinch()
            .wheel()
            .decelerate();

        this.stage.addChild(viewport);
        return viewport;
    }

    initGraphPaper(viewport) {
        const paper = new GraphPaper({
            graphWidth: 2000,
            graphHeight: 2000,
            ...GraphPaperStyle.dark(),
        });
        viewport.addChild(paper);
    }

    // Set dimensions
    initDimensions() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
    }

    // Init the gridded background
    initBackground(viewport = this.stage) {
        // Create a new empty Sprite and define its size
        const background = new PIXI.Sprite();
        background.width = this._width;
        background.height = this._height;
        // Get the code for the fragment shader
        const backgroundFragmentShader = CommonUtils.getElementById("backgroundFragment").textContent;
        // Create a new Filter using the fragment shader
        // We don't need a custom vertex shader, so we set it as `undefined`
        const backgroundFilter = new PIXI.Filter(undefined, backgroundFragmentShader);
        // Assign the filter to the background Sprite
        background.filters = [backgroundFilter];
        // Add the background to the stage
        viewport.addChild(background);
    }

    getAppWidth() {
        return this.screen.width;
    }

    // Get stage
    getCanvasElement() {
        return this.stage;
    }

    // Render new shapes, update shapes quantity and area
    renderShapes(shapeList: Shape[] = []) {
        shapeList.forEach((_) => {
            this.stage.addChild(_);
        });
    }
    renderImages(imageList: Imagee[] = []) {
        imageList.forEach((_) => {
            this.viewport.addChild(_);
        });
    }
}
