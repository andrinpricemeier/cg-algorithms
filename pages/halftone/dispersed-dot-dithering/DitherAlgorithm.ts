import { Matrix } from ".";

const quantize = (colors: number, ditherValues: number, inputPixel: number) => {
    return Math.floor(inputPixel / colors * ditherValues);
}

const ditherPixel = (quantizedPixel: number, ditherMatrixValue: number) => {
    if (quantizedPixel > ditherMatrixValue) {
        return 1;
    } else {
        return 0;
    }
}

const createEmptyDitheredMatrix = (rows: number, cols: number) => {
    const matrix = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const newRow = Array.from({ length: cols }, () => 0);
        matrix.push(newRow);
    }
    return matrix;
}

const dither = (colors: number, inputPixels: Matrix, ditherMatrix: Matrix) => {
    const dithered = createEmptyDitheredMatrix(inputPixels.length, inputPixels[0].length);
    const ditherRows = ditherMatrix.length;
    const ditherCols = ditherMatrix[0].length;
    for (let inputRow = 0; inputRow < inputPixels.length; inputRow++) {
        for (let inputCol = 0; inputCol < inputPixels[inputRow].length; inputCol++) {
            const ditherRow = inputRow % ditherRows;
            const ditherCol = inputCol % ditherCols;
            const quantizedPixel = quantize(colors, ditherRows * ditherCols + 1, inputPixels[inputRow][inputCol]);
            const ditheredPixel = ditherPixel(quantizedPixel, ditherMatrix[ditherRow][ditherCol]);
            dithered[inputRow][inputCol] = ditheredPixel;
        }
    }
    return dithered;
}

export default dither;