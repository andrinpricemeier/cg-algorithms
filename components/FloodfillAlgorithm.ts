import { Matrix } from "./Matrix";

const createEmptyPixelMatrix = (rows: number, cols: number, defaultValue: number) => {
    const matrix = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const newRow = Array.from({ length: cols }, () => defaultValue);
        matrix.push(newRow);
    }
    return matrix;
}

const isDisabled = (x: number, y: number, disabledPixels: [number, number][]) => {
    return disabledPixels.some(p => p[0] === y && p[1] === x);
}

const floodfillRec = (counter: number, x: number, y: number, pixelMatrix: Matrix, disabledPixels: [number, number][]) => {
    if (y < 0 || y > pixelMatrix.length - 1) {
        return counter;
    }
    if (x < 0 || x > pixelMatrix[y].length - 1) {
        return counter;
    }
    if (isDisabled(x, y, disabledPixels)) {
        return counter;
    }
    if (pixelMatrix[y][x] !== -1) {
        return counter;
    }
    pixelMatrix[y][x] = counter;
    let current = counter + 1;
    current = floodfillRec(current, x, y - 1, pixelMatrix, disabledPixels);
    current = floodfillRec(current, x - 1, y, pixelMatrix, disabledPixels);
    current = floodfillRec(current, x, y + 1, pixelMatrix, disabledPixels);
    current = floodfillRec(current, x + 1, y, pixelMatrix, disabledPixels);
    return current;
}

const floodfill = (rows: number, cols: number, startPixel: [number, number], disabledPixels: [number, number][]) => {
    const filled = createEmptyPixelMatrix(rows, cols, -1);
    let startValue = 1;
    floodfillRec(startValue, startPixel[1], startPixel[0], filled, disabledPixels);
    return filled;
}

export default floodfill;