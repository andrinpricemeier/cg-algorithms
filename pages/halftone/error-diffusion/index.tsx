import { TextField } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import deepClone from '../../../components/DeepClone'
import dither from '../../../components/ErrorDiffusionDitherAlgorithm'
import { Matrix } from '../../../components/Matrix'
import PixelGrid from '../../../components/PixelGrid'


const ErrorDiffusionPage: NextPage = () => {
    const [colors, setColors] = useState<number>(256);
    const [errorMatrix, setErrorMatrix] = useState<Matrix>([[-1, 0, 7/16], [1/16, 5/16, 3/16]]);
    const [inputPixelGridSize, setInputPixelGridSize] = useState<[number, number]>([1, 3]);
    const [inputPixelGrid, setInputPixelGrid] = useState<Matrix>([[30, 20, 255]]);
    const [ditheredPixelGrid, setDitheredPixelGrid] = useState<Matrix>([[0, 0, 0]]);

    const updateColors = useCallback((event) => {
        setColors(event.target.value);
    }, []);

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
        const dithered = dither(colors, inputPixelGrid, errorMatrix);
        setDitheredPixelGrid(dithered);
    }, [colors, inputPixelGrid, errorMatrix]);

    return (
        <div>
            <Head>
                <title>Error Diffusion (Halftone) - Computer Graphics Algorithms</title>
                <link
                    rel="canonical"
                    href="https://cg-algorithms.com/halftone/error-diffusion"
                    key="canonical"
                />
                <meta
                    name="description"
                    content="Find out how error diffusion works, a halftone technique, from the ground up."
                    key="desc"
                />
            </Head>
            <h1>Error diffusion</h1>
            <p>Error diffusion works by calculating the error for each pixel and distributing said pixel on its neighbours.</p>
            <h2>Simulation</h2>
            <TextField id="outlined-basic" label="Colors" onChange={updateColors} value={colors} variant="outlined" type="number" sx={{ marginRight: 2, width: 150 }} />
            <TextField InputProps={{ readOnly: true }} id="outlined-basic" label="Available output colors" value={2} variant="outlined" type="number" sx={{ width: 150 }} />
            <h3>Input pixels</h3>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Input pixel grid rows" name="inputpixelgrid-rows" onChange={updateInputPixelGridSize} value={inputPixelGridSize[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="Input pixel grid columns" name="inputpixelgrid-cols" onChange={updateInputPixelGridSize} value={inputPixelGridSize[1]} variant="outlined" type="number" />
            <PixelGrid values={inputPixelGrid} onValueChange={updateInputPixelGrid} />
            <h3>Error Matrix</h3>
            <PixelGrid values={errorMatrix} readOnly={true}/>
            <h3>Dithered output</h3>
            <PixelGrid values={ditheredPixelGrid} />
        </div>
    )
}

export default ErrorDiffusionPage
