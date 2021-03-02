/// <reference path="./types.d.ts" />

import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Renderer } from "@pixi/core";

import { InteractionEvent } from "@pixi/interaction";
import type { Handle } from "./Transformer";

/**
 * @see TransformerHandle#style
 */
export interface ITransformerHandleStyle {
    /**
     * Fill color of the handle
     */
    color: number;

    /**
     * Outline color of the handle
     */
    outlineColor: number;

    /**
     * Outline thickness around the handle
     */
    outlineThickness: number;

    /**
     * Radius (or size for non-circular handles) of the handle
     */
    radius: number;

    /**
     * {@link TransformerHandle} provides three types of handle shapes - 'circle', 'square', 'tooth'.
     */
    shape: string;
}

/**
 * The default transformer handle style.
 *
 * @ignore
 */
const DEFAULT_HANDLE_STYLE: ITransformerHandleStyle = {
    color: 0xffffff,
    outlineColor: 0x000000,
    outlineThickness: 1,
    radius: 8,
    shape: "tooth",
};

/**
 * The transfomer handle base implementation.
 */
export class TransformerHandle extends Graphics {
    onHandleDelta: (pointerPosition: Point) => void;
    onHandleCommit: () => void;

    protected _handle: Handle;
    protected _style: ITransformerHandleStyle;
    protected _dirty: boolean;

    private _pointerDown: boolean;
    private _pointerDragging: boolean;
    private _pointerPosition: Point;

    /**
     * @param {string} handle - the type of handle being drawn
     * @param {object} styleOpts - styling options passed by the user
     * @param {function} handler - handler for drag events, it receives the pointer position; used by {@code onDrag}.
     * @param {function} commit - handler for drag-end events.
     * @param {string}[cursor='move'] - a custom cursor to be applied on this handle
     */
    constructor(
        handle: Handle,
        styleOpts: Partial<ITransformerHandleStyle> = {},
        handler: (pointerPosition: Point) => void,
        commit: () => void,
        cursor?: string
    ) {
        super();

        const style: ITransformerHandleStyle = Object.assign({}, DEFAULT_HANDLE_STYLE, styleOpts);

        this._handle = handle;
        this._style = style;
        this.onHandleDelta = handler;
        this.onHandleCommit = commit;

        /**
         * This flags whether this handle should be redrawn in the next frame due to style changes.
         */
        this._dirty = true;

        // Pointer events
        this.interactive = true;
        this.cursor = cursor || "move";
        this._pointerDown = false;
        this._pointerDragging = false;
        this._pointerPosition = new Point();
        this.on("mousedown", this.onPointerDown, this);
        this.on("mousemove", this.onPointerMove, this);
        this.on("mouseup", this.onPointerUp, this);
        this.on("mouseupoutside", this.onPointerUp, this);
    }

    get handle(): Handle {
        return this._handle;
    }
    set handle(handle: Handle) {
        this._handle = handle;
        this._dirty = true;
    }

    /**
     * The currently applied handle style.
     */
    get style(): Partial<ITransformerHandleStyle> {
        return this._style;
    }
    set style(value: Partial<ITransformerHandleStyle>) {
        this._style = Object.assign({}, DEFAULT_HANDLE_STYLE, value);
        this._dirty = true;
    }

    render(renderer: Renderer): void {
        if (this._dirty) {
            this.draw();

            this._dirty = false;
        }

        super.render(renderer);
    }

    /**
     * Redraws the handle's geometry. This is called on a `render` if {@code this._dirty} is true.
     */
    protected draw(): void {
        const handle = this._handle;
        const style = this._style;

        const radius = style.radius;

        this.clear().lineStyle(style.outlineThickness, style.outlineColor).beginFill(style.color);

        if (style.shape === "square") {
            this.drawRect(-radius / 2, -radius / 2, radius, radius);
        } else if (style.shape === "tooth") {
            switch (handle) {
                case "middleLeft":
                    this.drawPolygon([
                        -radius / 2,
                        -radius / 2,
                        -radius / 2,
                        radius / 2,
                        radius / 2,
                        radius / 2,
                        radius * 1.1,
                        0,
                        radius / 2,
                        -radius / 2,
                    ]);
                    break;
                case "topCenter":
                    this.drawPolygon([
                        -radius / 2,
                        -radius / 2,
                        radius / 2,
                        -radius / 2,
                        radius / 2,
                        radius / 2,
                        0,
                        radius * 1.1,
                        -radius / 2,
                        radius / 2,
                    ]);
                    break;
                case "middleRight":
                    this.drawPolygon([
                        -radius / 2,
                        radius / 2,
                        -radius * 1.1,
                        0,
                        -radius / 2,
                        -radius / 2,
                        radius / 2,
                        -radius / 2,
                        radius / 2,
                        radius / 2,
                    ]);
                    break;
                case "bottomCenter":
                    this.drawPolygon([
                        0,
                        -radius * 1.1,
                        radius / 2,
                        -radius / 2,
                        radius / 2,
                        radius / 2,
                        -radius / 2,
                        radius / 2,
                        -radius / 2,
                        -radius / 2,
                    ]);
                    break;
                case "rotator":
                    this.drawCircle(0, 0, radius / Math.sqrt(2));
                    break;
                default:
                    this.drawRect(-radius / 2, -radius / 2, radius, radius);
                    break;
            }
        } else {
            this.drawCircle(0, 0, radius);
        }

        this.endFill();
    }

    /**
     * Handles the `pointerdown` event. You must call the super implementation.
     *
     * @param e
     */
    protected onPointerDown(e: InteractionEvent): void {
        this._pointerDown = true;
        this._pointerDragging = false;

        e.stopPropagation();
    }

    /**
     * Handles the `pointermove` event. You must call the super implementation.
     *
     * @param e
     */
    protected onPointerMove(e: InteractionEvent): void {
        if (!this._pointerDown) {
            return;
        }

        if (this._pointerDragging) {
            this.onDrag(e);
        } else {
            this.onDragStart(e);
        }

        e.stopPropagation();
    }

    /**
     * Handles the `pointerup` event. You must call the super implementation.
     *
     * @param e
     */
    protected onPointerUp(e: InteractionEvent): void {
        if (this._pointerDragging) {
            this.onDragEnd(e);
        }

        this._pointerDown = false;
    }

    /**
     * Called on the first `pointermove` when {@code this._pointerDown} is true. You must call the super implementation.
     *
     * @param e
     */
    protected onDragStart(e: InteractionEvent): void {
        this._pointerPosition.copyFrom(e.data.global);

        this._pointerDragging = true;
    }

    /**
     * Called on a `pointermove` when {@code this._pointerDown} & {@code this._pointerDragging}.
     *
     * @param e
     */
    protected onDrag(e: InteractionEvent): void {
        const currentPosition = e.data.global;

        // Callback handles the rest!
        if (this.onHandleDelta) {
            this.onHandleDelta(currentPosition);
        }

        this._pointerPosition.copyFrom(currentPosition);
    }

    /**
     * Called on a `pointerup` or `pointerupoutside` & {@code this._pointerDragging} was true.
     *
     * @param _
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onDragEnd(_: InteractionEvent): void {
        this._pointerDragging = false;

        if (this.onHandleCommit) {
            this.onHandleCommit();
        }
    }
}
