import * as PIXI from "pixi.js";
export class CommonUtils {
    static loadGameAssets = (): Promise<void> => {
        return new Promise((res, rej) => {
            const loader = PIXI.Loader.shared;
            loader.add("rabbit", "./assets/simpleSpriteSheet.json");

            loader.onComplete.once(() => {
                res();
            });

            loader.onError.once(() => {
                rej();
            });

            loader.load();
        });
    };
    static getElementById = (id) => {
        return document.getElementById(id);
    };
    static getRandomColor = () => {
        return Math.random() * 0xffffff;
    };

    static getRandomPos = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    static getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    static getPolygonArea = (paths: number[] = []) => {
        const posX = paths.filter((x, index) => index % 2 === 0).concat(paths[0]);
        const posY = paths.filter((y, index) => index % 2 !== 0).concat(paths[1]);

        const sumX = posX.reduce((total, current, index) => {
            if (index === posX.length - 1) return total;
            return total + current * posY[index + 1];
        }, 0);

        const sumY = posY.reduce((total, current, index) => {
            if (index === posY.length - 1) return total;
            return total + current * posX[index + 1];
        }, 0);

        return Math.abs(sumX - sumY);
    };

    static getDistance = (a, b) => {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    };

    static getAngleRadians(x, y) {
        return Math.atan2(y, x);
    }

    // static getShapesArea = (shapes = []) => {
    //     return shapes.reduce((total, current) => {
    //         return total + current.area;
    //     }, 0);
    // };
}
