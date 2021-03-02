// import { Shape, Rectangle as Rect } from "../model/Shape/Shape";
// import * as PIXI from "pixi.js";
// import { CommonUtils } from "./Util";
// import Graphics = PIXI.Graphics;
// import Rectangle = PIXI.Rectangle;
// export class FreeTransform extends PIXI.Container {
//     static isExists = false;
//     static instance: FreeTransform;
//     constructor(stage: PIXI.Container) {
//         if (FreeTransform.isExists) return FreeTransform.instance;
//         super();
//         stage.addChild(this);
//         FreeTransform.instance = this;
//         FreeTransform.isExists = true;
//     }
//
//     addShape(shape: Rect) {
//         this.zIndex = 9999;
//         const movingThreshold = 1;
//         const cornerSize = 10;
//         const borderShape = new Graphics();
//         const cornerShapeList = [new Graphics(), new Graphics(), new Graphics(), new Graphics()];
//         const sideShapeList = [new Graphics(), new Graphics(), new Graphics(), new Graphics()];
//         const rotateShape = new Graphics();
//         const addBorderShape = () => {
//             this.addChild(borderShape);
//         };
//         const addSideShape = () => {
//             sideShapeList.forEach((_, index) => {
//                 this.addChild(_);
//                 let dataGlobal;
//                 let targetStart;
//                 let dragging = false;
//                 const sideShapeDrag = {
//                     start: (event) => {
//                         event.stopPropagation();
//                         dataGlobal = event.data.global.clone();
//                         targetStart = {
//                             width: shape.width,
//                             height: shape.height,
//                             x: shape.x,
//                             y: shape.y,
//                             rotation: shape.rotation,
//                         };
//                         dragging = true;
//                         updateTool();
//                     },
//
//                     end: () => {
//                         shape.alpha = 1;
//                         dragging = false;
//                     },
//                     move: (event, index) => {
//                         if (dragging) {
//                             const newDataGlobal = event.data.global.clone();
//                             const diffX = newDataGlobal.x - dataGlobal.x;
//                             const diffY = newDataGlobal.y - dataGlobal.y;
//                             const rotation = targetStart.rotation;
//                             if (rotation < Math.PI / 2) {
//                                 index = index;
//                             } else if (rotation >= Math.PI / 2 && rotation < Math.PI) {
//                                 debugger;
//                                 index += 1;
//                                 if (index === 4) {
//                                     index = 0;
//                                 }
//                             }
//                             switch (index) {
//                                 case 0:
//                                     shape.draw(
//                                         targetStart.width,
//                                         targetStart.height - diffY,
//                                         new PIXI.Point(
//                                             targetStart.x - targetStart.width / 2,
//                                             targetStart.y - targetStart.height / 2 + diffY
//                                         )
//                                     );
//                                     break;
//                                 case 1:
//                                     shape.draw(
//                                         targetStart.width + diffX,
//                                         targetStart.height,
//                                         new PIXI.Point(
//                                             targetStart.x - targetStart.width / 2,
//                                             targetStart.y - targetStart.height / 2
//                                         )
//                                     );
//                                     break;
//                                 case 2:
//                                     shape.draw(
//                                         targetStart.width,
//                                         targetStart.height + diffY,
//                                         new PIXI.Point(
//                                             targetStart.x - targetStart.width / 2,
//                                             targetStart.y - targetStart.height / 2
//                                         )
//                                     );
//                                     break;
//                                 case 3:
//                                     shape.draw(
//                                         targetStart.width - diffX,
//                                         targetStart.height,
//                                         new PIXI.Point(
//                                             targetStart.x - targetStart.width / 2 + diffX,
//                                             targetStart.y - targetStart.height / 2
//                                         )
//                                     );
//                                     break;
//                                 default:
//                                     break;
//                             }
//                             shape.alpha = 0.5;
//                             updateTool();
//                         }
//                     },
//                 };
//                 _.on("pointerdown", sideShapeDrag.start)
//                     .on("pointerup", sideShapeDrag.end)
//                     .on("pointerupoutside", sideShapeDrag.end)
//                     .on("pointermove", (event) => {
//                         sideShapeDrag.move(event, index);
//                     });
//             });
//         };
//         const addCornerShape = () => {
//             cornerShapeList.forEach((_, index) => {
//                 this.addChild(_);
//
//                 let dataGlobal;
//                 let targetStart;
//                 let dragging = false;
//                 const cornerShapeDrag = {
//                     start: (event) => {
//                         event.stopPropagation();
//                         dataGlobal = event.data.global.clone();
//                         targetStart = {
//                             width: shape.width,
//                             height: shape.height,
//                         };
//                         dragging = true;
//                         updateTool();
//                     },
//
//                     end: () => {
//                         shape.alpha = 1;
//                         dragging = false;
//                     },
//                     move: (event, index) => {
//                         if (dragging) {
//                             const newDataGlobal = event.data.global.clone();
//                             // shape.x = positionStart.x + newDataGlobal.x - dataGlobal.x;
//                             // shape.y = positionStart.y + newDataGlobal.y - dataGlobal.y;
//                             const diffX = newDataGlobal.x - dataGlobal.x;
//                             const diffY = newDataGlobal.y - dataGlobal.y;
//                             const diff = CommonUtils.getDistance(newDataGlobal, dataGlobal);
//                             let ratio = 1;
//                             switch (index) {
//                                 case 0:
//                                     ratio = (targetStart.width - diffX) / targetStart.width;
//                                     break;
//                                 default:
//                                     break;
//                             }
//                             shape.width = targetStart.width * ratio;
//                             shape.height = targetStart.height * ratio;
//                             shape.alpha = 0.5;
//                             updateTool();
//                         }
//                     },
//                 };
//                 _.on("pointerdown", cornerShapeDrag.start)
//                     .on("pointerup", cornerShapeDrag.end)
//                     .on("pointerupoutside", cornerShapeDrag.end)
//                     .on("pointermove", (event) => {
//                         cornerShapeDrag.move(event, index);
//                     });
//             });
//         };
//         const addRotateShape = () => {
//             this.addChild(rotateShape);
//             let dataGlobal;
//             let rotationStart;
//             let dragging = false;
//             const rotateShapeDrag = {
//                 start: (event) => {
//                     event.stopPropagation();
//                     dataGlobal = event.data.global.clone();
//                     rotationStart = event.target.rotation;
//                     dragging = true;
//                     updateTool();
//                 },
//
//                 end: () => {
//                     shape.alpha = 1;
//                     dragging = false;
//                 },
//                 move: (event) => {
//                     if (dragging) {
//                         const newDataGlobal = event.data.global.clone();
//                         const relativeStartPoint = {
//                             x: dataGlobal.x - shape.x,
//                             y: dataGlobal.y - shape.y,
//                         };
//                         const relativeEndPoint = {
//                             x: newDataGlobal.x - shape.x,
//                             y: newDataGlobal.y - shape.y,
//                         };
//                         const rotation =
//                             CommonUtils.getAngleRadians(relativeEndPoint.x, relativeEndPoint.y) -
//                             CommonUtils.getAngleRadians(relativeStartPoint.x, relativeStartPoint.y);
//                         shape.alpha = 0.5;
//                         shape.rotation = rotationStart + rotation;
//                         updateTool();
//                     }
//                 },
//             };
//             rotateShape
//                 .on("pointerdown", rotateShapeDrag.start)
//                 .on("pointerup", rotateShapeDrag.end)
//                 .on("pointerupoutside", rotateShapeDrag.end)
//                 .on("pointermove", rotateShapeDrag.move);
//         };
//         const addTool = () => {
//             addBorderShape();
//             addCornerShape();
//             addRotateShape();
//             addSideShape();
//         };
//         addTool();
//         const updateBorderShape = () => {
//             borderShape.clear();
//             borderShape.pivot.x = shape.pivot.x;
//             borderShape.pivot.y = shape.pivot.y;
//             borderShape.position.x = shape.position.x;
//             borderShape.position.y = shape.position.y;
//             borderShape
//                 .lineStyle(1)
//                 .drawRect(
//                     shape.position.x - shape.width / 2,
//                     shape.position.y - shape.height / 2,
//                     shape.width,
//                     shape.height
//                 );
//             borderShape.rotation = shape.rotation;
//         };
//         const updateRotateShape = () => {
//             rotateShape.clear();
//             rotateShape.position.x = shape.position.x;
//             rotateShape.position.y = shape.position.y;
//             rotateShape.lineStyle(1).drawRect(-cornerSize / 2, shape.height / 2 + 30, cornerSize, cornerSize);
//             rotateShape.interactive = true;
//             rotateShape.buttonMode = true;
//             rotateShape.rotation = shape.rotation;
//             rotateShape.hitArea = new Rectangle(-cornerSize / 2, shape.height / 2 + 30, cornerSize, cornerSize);
//         };
//         const updateCornerShape = () => {
//             cornerShapeList.forEach((_, index) => {
//                 _.clear();
//                 _.position.x = shape.position.x;
//                 _.position.y = shape.position.y;
//                 _.rotation = shape.rotation;
//                 _.pivot.x = shape.pivot.x;
//                 _.pivot.y = shape.pivot.y;
//                 _.interactive = true;
//                 _.buttonMode = true;
//                 switch (index) {
//                     case 0:
//                         _.lineStyle(1).drawRect(
//                             shape.x - shape.width / 2 - cornerSize / 2,
//                             shape.y - shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         _.hitArea = new Rectangle(
//                             shape.x - shape.width / 2 - cornerSize / 2,
//                             shape.y - shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 1:
//                         _.lineStyle(1).drawRect(
//                             shape.x + shape.width / 2 - cornerSize / 2,
//                             shape.y - shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//
//                         _.hitArea = new Rectangle(
//                             shape.x + shape.width / 2 - cornerSize / 2,
//                             shape.y - shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 2:
//                         _.lineStyle(1).drawRect(
//                             shape.x + shape.width / 2 - cornerSize / 2,
//                             shape.y + shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//
//                         _.hitArea = new Rectangle(
//                             shape.x + shape.width / 2 - cornerSize / 2,
//                             shape.y + shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 3:
//                         _.lineStyle(1).drawRect(
//                             shape.x - shape.width / 2 - cornerSize / 2,
//                             shape.y + shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         _.hitArea = new Rectangle(
//                             shape.x - shape.width / 2 - cornerSize / 2,
//                             shape.y + shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     default:
//                         break;
//                 }
//             });
//         };
//         const updateSideShape = () => {
//             sideShapeList.forEach((_, index) => {
//                 _.clear();
//                 _.position.x = shape.position.x;
//                 _.position.y = shape.position.y;
//                 _.rotation = shape.rotation;
//                 _.interactive = true;
//                 _.buttonMode = true;
//                 switch (index) {
//                     case 0:
//                         _.lineStyle(1).drawRect(
//                             -cornerSize / 2,
//                             -shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         _.hitArea = new Rectangle(
//                             -cornerSize / 2,
//                             -shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 1:
//                         _.lineStyle(1).drawRect(
//                             shape.width / 2 - cornerSize / 2,
//                             -cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//
//                         _.hitArea = new Rectangle(
//                             shape.width / 2 - cornerSize / 2,
//                             -cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 2:
//                         _.lineStyle(1).drawRect(
//                             -cornerSize / 2,
//                             shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//
//                         _.hitArea = new Rectangle(
//                             -cornerSize / 2,
//                             shape.height / 2 - cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     case 3:
//                         _.lineStyle(1).drawRect(
//                             -shape.width / 2 - cornerSize / 2,
//                             -cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         _.hitArea = new Rectangle(
//                             -shape.width / 2 - cornerSize / 2,
//                             -cornerSize / 2,
//                             cornerSize,
//                             cornerSize
//                         );
//                         break;
//                     default:
//                         break;
//                 }
//             });
//         };
//         const updateTool = () => {
//             updateBorderShape();
//             // updateCornerShape();
//             updateRotateShape();
//             updateSideShape();
//         };
//
//         let dataGlobal;
//         let positionStart;
//         let dragging = false;
//         const shapeDrag = {
//             start: (event) => {
//                 event.stopPropagation();
//                 dataGlobal = event.data.global.clone();
//                 positionStart = event.target.position.clone();
//                 dragging = true;
//                 updateTool();
//             },
//
//             end: () => {
//                 shape.alpha = 1;
//                 dragging = false;
//             },
//             move: (event) => {
//                 if (dragging) {
//                     const newDataGlobal = event.data.global.clone();
//                     const movingEnabled = CommonUtils.getDistance(newDataGlobal, dataGlobal) > movingThreshold;
//                     if (movingEnabled) {
//                         shape.alpha = 0.5;
//                         shape.draw(
//                             shape.width,
//                             shape.height,
//                             new PIXI.Point(
//                                 positionStart.x - shape.width / 2 + newDataGlobal.x - dataGlobal.x,
//                                 positionStart.y - shape.height / 2 + newDataGlobal.y - dataGlobal.y
//                             )
//                         );
//                         updateTool();
//                     }
//                 }
//             },
//         };
//         shape
//             .on("pointerdown", shapeDrag.start)
//             .on("pointerup", shapeDrag.end)
//             .on("pointerupoutside", shapeDrag.end)
//             .on("pointermove", shapeDrag.move);
//     }
// }
