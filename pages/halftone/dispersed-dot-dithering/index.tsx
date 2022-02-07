import { TextField } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import deepClone from '../../../components/DeepClone'
import dither from '../../../components/DispersedDotDitherAlgorithm'
import { Matrix } from '../../../components/Matrix'
import PixelGrid from '../../../components/PixelGrid'


const DispersedDotDitheringPage: NextPage = () => {
    const [colors, setColors] = useState<number>(256);
    const [ditherMatrixSize, setDitherMatrixSize] = useState<[number, number]>([2, 2]);
    const [ditherMatrix, setDitherMatrix] = useState<Matrix>([[0, 3], [1, 2]]);
    const [inputPixelGridSize, setInputPixelGridSize] = useState<[number, number]>([1, 3]);
    const [inputPixelGrid, setInputPixelGrid] = useState<Matrix>([[30, 20, 255]]);
    const [ditheredPixelGrid, setDitheredPixelGrid] = useState<Matrix>([[0, 0, 0]]);

    const predefinedDitherMatrices = useMemo(() => {
        const matrices = new Map();
        matrices.set(4, [[0, 3], [1, 2]]);
        matrices.set(9, [[6, 8, 4], [1, 0, 3], [5, 2, 7]]);
        return matrices;
    }, []);

    const updateColors = useCallback((event) => {
        setColors(event.target.value);
    }, []);

    const updateDitherMatrixSize = useCallback((event) => {
        if (event.target.name === "dithermatrix-rows") {
            setDitherMatrixSize([event.target.value, ditherMatrixSize[1]]);
        } else {
            setDitherMatrixSize([ditherMatrixSize[0], event.target.value]);
        }
    }, [ditherMatrixSize]);

    useEffect(() => {
        const size = ditherMatrixSize[0] * ditherMatrixSize[1];
        if (predefinedDitherMatrices.has(size)) {
            const newMatrix = predefinedDitherMatrices.get(size);
            setDitherMatrix(deepClone(newMatrix));
        } else {
            const newMatrix = [];
            for (let rowIndex = 0; rowIndex < ditherMatrixSize[0]; rowIndex++) {
                const max = size - 1;
                const min = 0;
                const newRow = Array.from({ length: Math.max(ditherMatrixSize[1], 1) }, () => Math.floor(Math.random() * (max - min + 1) + min));
                newMatrix.push(newRow);
            }
            setDitherMatrix(newMatrix);
        }
    }, [ditherMatrixSize, predefinedDitherMatrices]);

    const updateDitherMatrix = useCallback((index: [number, number], value: number) => {
        const row = index[0];
        const col = index[1];
        const copy = deepClone(ditherMatrix);
        copy[row][col] = value;
        setDitherMatrix(copy);
    }, [ditherMatrix]);

    const updateInputPixelGridSize = useCallback((event) => {
        if (event.target.name === "inputpixelgrid-rows") {
            setInputPixelGridSize([event.target.value, inputPixelGridSize[1]]);
        } else {
            setInputPixelGridSize([inputPixelGridSize[0], event.target.value]);
        }
    }, [inputPixelGridSize]);

    useEffect(() => {
        const max = colors - 1;
        const min = 0;
        const newMatrix = [];
        for (let rowIndex = 0; rowIndex < inputPixelGridSize[0]; rowIndex++) {
            const newRow = Array.from({ length: Math.max(inputPixelGridSize[1], 1) }, () => Math.floor(Math.random() * (max - min + 1) + min));
            newMatrix.push(newRow);
        }
        setInputPixelGrid(newMatrix);
    }, [colors, inputPixelGridSize]);

    const updateInputPixelGrid = useCallback((index: [number, number], value: number) => {
        const row = index[0];
        const col = index[1];
        const copy = deepClone(inputPixelGrid);
        copy[row][col] = value;
        setInputPixelGrid(copy);
    }, [inputPixelGrid]);

    useEffect(() => {
        const dithered = dither(colors, inputPixelGrid, ditherMatrix);
        setDitheredPixelGrid(dithered);
    }, [colors, inputPixelGrid, ditherMatrix]);

    return (
        <div>
            <Head>
                <title>Dispersed Dot Dithering (Halftone) - Computer Graphics Algorithms</title>
                <link
                    rel="canonical"
                    href="https://cg-algorithms.com/halftone/dispersed-dot-dithering"
                    key="canonical"
                />
                <meta
                    name="description"
                    content="Find out how dispersed dot dithering, a halftone technique, works from the ground up."
                    key="desc"
                />
            </Head>
            <h1>Dispersed Dot Dithering</h1>
            <p>Dispersed dot dithering is a technique for reproducing an image where only a tiny fraction of colors are available using the same resolution. It works by first quantizing the original colors and then applying a so called dither matrix.</p>
            <h2>Simulation</h2>
            <TextField id="outlined-basic" label="Colors" onChange={updateColors} value={colors} variant="outlined" type="number" sx={{ marginRight: 2, width: 150 }} />
            <TextField InputProps={{ readOnly: true }} id="outlined-basic" label="Available output colors" value={2} variant="outlined" type="number" sx={{ width: 150 }} />
            <h3>Input pixels</h3>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Input pixel grid rows" name="inputpixelgrid-rows" onChange={updateInputPixelGridSize} value={inputPixelGridSize[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="Input pixel grid columns" name="inputpixelgrid-cols" onChange={updateInputPixelGridSize} value={inputPixelGridSize[1]} variant="outlined" type="number" />
            <PixelGrid values={inputPixelGrid} onValueChange={updateInputPixelGrid} />
            <h3>Dithermatrix</h3>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Dithermatrix rows" name="dithermatrix-rows" onChange={updateDitherMatrixSize} value={ditherMatrixSize[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="Dithermatrix columns" name="dithermatrix-cols" onChange={updateDitherMatrixSize} value={ditherMatrixSize[1]} variant="outlined" type="number" />
            <PixelGrid values={ditherMatrix} onValueChange={updateDitherMatrix} />
            <h3>Dithered output</h3>
            <PixelGrid values={ditheredPixelGrid} />
        </div>
    )
}

export default DispersedDotDitheringPage
