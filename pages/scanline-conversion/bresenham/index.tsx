import { TextField } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import bresenham from '../../../components/BresenhamAlgorithm';

const BresenhamPage: NextPage = () => {
    const [startPoint, setStartPoint] = useState<[number, number]>([1, 1]);
    const [endPoint, setEndPoint] = useState<[number, number]>([3, 5]);
    const [points, setPoints] = useState<[number, number][]>([]);
    const [log, setLog] = useState<string[]>([]);

    const updateStartPoint = useCallback((event) => {
        if (event.target.name === "startpoint-x") {
            setStartPoint([+event.target.value, startPoint[1]]);
        } else {
            setStartPoint([startPoint[0], +event.target.value]);
        }
    }, [startPoint]);

    const updateEndPoint = useCallback((event) => {
        if (event.target.name === "endpoint-x") {
            setEndPoint([+event.target.value, endPoint[1]]);
        } else {
            setEndPoint([endPoint[0], +event.target.value]);
        }
    }, [endPoint]);

    useEffect(() => {
        const result = bresenham(startPoint, endPoint);
        setLog(result.log);
        setPoints(result.points);
    }, [startPoint, endPoint]);

    return (
        <div>
            <Head>
                <title>Bresenham Algorithm - Computer Graphics Algorithms</title>
                <link
                    rel="canonical"
                    href="https://cg-algorithms.com/scanline-conversion/bresenham"
                    key="canonical"
                />
                <meta
                    name="description"
                    content="Find out how the bresenham algorithm works."
                    key="desc"
                />
            </Head>
            <h1>Bresenham Algorithm</h1>
            <p>The Bresenham algorithm is also known as the Midpoint algorithm. It is used for rasterizing lines.</p>
            <h2>Simulation</h2>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Start point x" name="startpoint-x" onChange={updateStartPoint} value={startPoint[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="Start point y" name="startpoint-y" onChange={updateStartPoint} value={startPoint[1]} variant="outlined" type="number" />
            <br/>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="End point x" name="endpoint-x" onChange={updateEndPoint} value={endPoint[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, width: 150 }} id="outlined-basic" label="End point y" name="endpoint-y" onChange={updateEndPoint} value={endPoint[1]} variant="outlined" type="number" />
            <h3>Computed values</h3>
            {log.map((entry, index) => {
                return (
                    <p key={index}>{entry}</p>
                )
            })}
        </div>
    )
}

export default BresenhamPage
