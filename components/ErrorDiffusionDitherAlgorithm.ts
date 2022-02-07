import deepClone from "./DeepClone";
import { Matrix } from "./Matrix";

const closestValue = (colors: number, value: number): number => {
    const middle = (colors - 1) / 2;
    if (value >= middle) {
        return colors - 1;
    } else {
        return 0;
    }
}

const computeError = (colors: number, value: number): number => {
    return value - closestValue(colors, value);
}

const findOrigin = (errorMatrix: Matrix): [number, number] => {
    for (let rowIndex = 0; rowIndex < errorMatrix.length; rowIndex++) {
        for (let colIndex = 0; colIndex < errorMatrix[rowIndex].length; colIndex++) {
            if (errorMatrix[rowIndex][colIndex] === 0) {
                return [rowIndex, colIndex];
            }
        }
    }
    return [0, 0];
}

const leaveAlonePixel = (value: number): boolean => {
    return value === -1;
}

const dither = (colors: number, inputPixels: Matrix, errorMatrix: Matrix) => {
    const dithered = deepClone(inputPixels);
    const origin = findOrigin(errorMatrix);
    for (let inputRow = 0; inputRow < inputPixels.length; inputRow++) {
        for (let inputCol = 0; inputCol < inputPixels[inputRow].length; inputCol++) {
            const error = computeError(colors, dithered[inputRow][inputCol]);
            const roundedPixel = closestValue(colors, dithered[inputRow][inputCol]);
            dithered[inputRow][inputCol] = roundedPixel;
            for (let errorRow = 0; errorRow < errorMatrix.length; errorRow++) {
                for (let errorCol = 0; errorCol < errorMatrix[errorRow].length; errorCol++) {
                    const offset = [errorRow - origin[0], errorCol - origin[1]];
                    const errorFactor = errorMatrix[errorRow][errorCol];
                    if (leaveAlonePixel(errorFactor)) {
                        continue;
                    }
                    if (errorRow == origin[0] && errorCol === origin[1]) {
                        continue;
                    }
                    const inputRowToChange = inputRow + offset[0];
                    const inputColToChange = inputCol + offset[1];
                    if (inputRowToChange >= 0 && inputRowToChange < inputPixels.length && inputColToChange >= 0 && inputColToChange < inputPixels[inputRowToChange].length) {
                        const oldValue = dithered[inputRowToChange][inputColToChange];
                        const valueWithErrorApplied = oldValue + error * errorFactor;
                        dithered[inputRowToChange][inputColToChange] = valueWithErrorApplied;
                    }
                }
            }
        }
    }
    return dithered;
}

export default dither;