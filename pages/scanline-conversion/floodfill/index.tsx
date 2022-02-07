import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import deepClone from '../../../components/DeepClone'
import floodfill from '../../../components/FloodfillAlgorithm'
import { Matrix } from '../../../components/Matrix'
import ReadOnlyPixelGrid from '../../../components/ReadOnlyPixelGrid'


const FloodfillPage: NextPage = () => {
    const [pixelSize, setPixelSize] = useState<[number, number]>([3, 5]);
    const [pixelGrid, setPixelGrid] = useState<Matrix>([[30, 20, 255]]);
    const [stateMatrix, setStateMatrix] = useState<Matrix>([[0, 0, 0]]);

    const updatePixelSize = useCallback((event) => {
        if (event.target.name === "pixel-rows") {
            setPixelSize([event.target.value, pixelSize[1]]);
        } else {
            setPixelSize([pixelSize[0], event.target.value]);
        }
    }, [pixelSize]);

    const stateChange = useCallback((pixel: [number, number], state: number) => {
        const copy = deepClone(stateMatrix);
        copy[pixel[0]][pixel[1]] = state;
        setStateMatrix(copy);
    }, [stateMatrix]);

    useEffect(() => {
        const newMatrix = [];
        const stateMatrix = [];
        for (let rowIndex = 0; rowIndex < pixelSize[0]; rowIndex++) {
            const newRow = Array.from({ length: Math.max(pixelSize[1], 1) }, () => 0);
            newMatrix.push(newRow);            
            const states = Array.from({ length: Math.max(pixelSize[1], 1) }, () => 0);
            stateMatrix.push(states);
        }
        setPixelGrid(newMatrix);
        setStateMatrix(stateMatrix);
    }, [pixelSize]);

    useEffect(() => {
        let startPixel: [number, number] = [0, 0];
        const disabledPixels: [number, number][] = [];
        for (let row = 0; row < stateMatrix.length; row++) {
            for (let col = 0; col < stateMatrix[row].length; col++) {
                const state = stateMatrix[row][col];
                if (state === 1) {
                    startPixel = [row, col];
                } else if (state === 2) {
                    disabledPixels.push([row, col]);
                }
            }
        }
        const filled = floodfill(pixelSize[0], pixelSize[1], startPixel, disabledPixels);
        setPixelGrid(filled);
    }, [pixelSize, stateMatrix]);

    return (
        <div>
            <Head>
                <title>Floodfill Algorithm - Computer Graphics Algorithms</title>
                <link
                    rel="canonical"
                    href="https://cg-algorithms.com/scanline-conversion/floodfill"
                    key="canonical"
                />
                <meta
                    name="description"
                    content="Find out how the floodfill algorithm works."
                    key="desc"
                />
            </Head>
            <h1>Floodfill Algorithm</h1>
            <p>The floodfill algorithm is an algorithm for filling out pixels with colors.</p>
            <h2>Simulation</h2>
            <p>Choose the parameters and select the start field by clicking on it once. Clicking on a field twice disables it.</p>
            <h3>Grid size</h3>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Pixel rows" name="pixel-rows" onChange={updatePixelSize} value={pixelSize[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="Pixel columns" name="pixel-cols" onChange={updatePixelSize} value={pixelSize[1]} variant="outlined" type="number" />
            <h3>Pixels</h3>
            <ReadOnlyPixelGrid states={stateMatrix} onStateChange={stateChange} values={pixelGrid} />
        </div>
    )
}

export default FloodfillPage
