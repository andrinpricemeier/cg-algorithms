import { TextField } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
import diffuse from '../../../components/DiffuseLighting';
import { loadAndCompileShaders } from './shaderUtils';

const ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexNormalId: -1,
    uModelMatrixId: -1,
    uModelNormalMatrix: -1
};

let gl: any;

const setUpAttributesAndUniforms = () => {
    ctx.aVertexPositionId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aVertexPosition"
    );
    ctx.aVertexColorId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aVertexColor"
    );
    ctx.aVertexNormalId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aVertexNormal"
    );
    ctx.uModelMatrixId = gl.getUniformLocation(
        ctx.shaderProgram,
        "uModelMatrix"
    );
}

const drawScene = (lightPoint: [number, number, number], normal: [number, number, number], objectPoint: [number, number, number]) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, 25], [0, 0, 0], [0, 1, 0]);
    const matrixId = gl.getUniformLocation(ctx.shaderProgram, "uViewMatrix");
    gl.uniformMatrix4fv(matrixId, false, viewMatrix);
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, viewMatrix);

    const projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -10, 10, -10, 10, 1, 50);
    const id = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    gl.uniformMatrix4fv(id, false, projectionMatrix);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(objectPoint.concat(lightPoint).concat(objectPoint).concat([objectPoint[0] + normal[0], objectPoint[1] + normal[1], objectPoint[2] + normal[2]])),
        gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
        ctx.aVertexPositionId,
        3,
        gl.FLOAT,
        false,
        0,
        0
    );
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.drawArrays(gl.LINES, 0, 2);    
    gl.drawArrays(gl.LINES, 2, 2);
}

const DiffuseLightingPage: NextPage = () => {
    const [lightPoint, setLightPoint] = useState<[number, number, number]>([0, 4, -3]);
    const [normal, setNormal] = useState<[number, number, number]>([0, 1, 0]);
    const [objectPoint, setObjectPoint] = useState<[number, number, number]>([0, 0, 0]);
    const [color, setColor] = useState<[number, number, number]>([1, 1, 1]);
    const [coefficient, setCoefficient] = useState<[number, number, number]>([0.5, 0.5, 0.5]);
    const [reflectedColor, setReflectedColor] = useState<[number, number, number]>([0, 0, 0]);
    const canvasRef = useRef(null);

    useEffect(() => {
        async function initCanvas() {
            if (!canvasRef.current) {
                return;
            }
            const canvas = canvasRef.current as any;
            gl = canvas.getContext("webgl");
            ctx.shaderProgram = await loadAndCompileShaders(
                gl,
                "/lighting/diffuse/VertexShader.glsl",
                "/lighting/diffuse/FragmentShader.glsl"
            );
            setUpAttributesAndUniforms();
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.clearColor(0, 0, 0, 1);
            drawScene(lightPoint, normal, objectPoint);
        }
        initCanvas();
    }, [canvasRef, lightPoint, objectPoint, normal]);

    const updateLightPoint = useCallback((event) => {
        if (event.target.name === "lightpoint-x") {
            setLightPoint([+event.target.value, lightPoint[1], lightPoint[2]]);
        } else if (event.target.name === "lightpoint-y") {
            setLightPoint([lightPoint[0], +event.target.value, lightPoint[2]]);
        } else {
            setLightPoint([lightPoint[0], lightPoint[1], +event.target.value]);
        }
    }, [lightPoint]);

    const updateNormal = useCallback((event) => {
        if (event.target.name === "normal-x") {
            setNormal([+event.target.value, normal[1], normal[2]]);
        } else if (event.target.name === "normal-y") {
            setNormal([normal[0], +event.target.value, normal[2]]);
        } else {
            setNormal([normal[0], normal[1], +event.target.value]);
        }
    }, [normal]);

    const updateObject = useCallback((event) => {
        if (event.target.name === "object-x") {
            setObjectPoint([+event.target.value, objectPoint[1], objectPoint[2]]);
        } else if (event.target.name === "object-y") {
            setObjectPoint([objectPoint[0], +event.target.value, objectPoint[2]]);
        } else {
            setObjectPoint([objectPoint[0], objectPoint[1], +event.target.value]);
        }
    }, [objectPoint]);

    const updateColor = useCallback((event) => {
        if (event.target.name === "color-r") {
            setColor([+event.target.value, color[1], color[2]]);
        } else if (event.target.name === "color-g") {
            setColor([color[0], +event.target.value, color[2]]);
        } else {
            setColor([color[0], color[1], +event.target.value]);
        }
    }, [color]);

    const updateCoefficient = useCallback((event) => {
        if (event.target.name === "coefficient-r") {
            setCoefficient([+event.target.value, coefficient[1], coefficient[2]]);
        } else if (event.target.name === "coefficient-g") {
            setCoefficient([coefficient[0], +event.target.value, coefficient[2]]);
        } else {
            setCoefficient([coefficient[0], coefficient[1], +event.target.value]);
        }
    }, [coefficient]);

    useEffect(() => {
        const reflected = diffuse(lightPoint, normal, objectPoint, color, coefficient);
        setReflectedColor(reflected);
    }, [lightPoint, normal, objectPoint, color, coefficient]);

    return (
        <div>
            <Head>
                <title>Diffuse Lighting - Computer Graphics Algorithms</title>
                <link
                    rel="canonical"
                    href="https://cg-algorithms.com/lighting/diffuse"
                    key="canonical"
                />
                <meta
                    name="description"
                    content="Find out how diffuse lighting works."
                    key="desc"
                />
            </Head>
            <h1>Diffuse Lighting</h1>
            <p>Diffuse Lighting simulates a matt finish and reflects light equally in all directions.</p>
            <h2>Simulation</h2>
            <h3>Parameters</h3>
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Light Point x" name="lightpoint-x" onChange={updateLightPoint} value={lightPoint[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Light Point y" name="lightpoint-y" onChange={updateLightPoint} value={lightPoint[1]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Light Point z" name="lightpoint-z" onChange={updateLightPoint} value={lightPoint[2]} variant="outlined" type="number" />
            <br />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Normal x" name="normal-x" onChange={updateNormal} value={normal[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Normal y" name="normal-y" onChange={updateNormal} value={normal[1]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Normal z" name="normal-z" onChange={updateNormal} value={normal[2]} variant="outlined" type="number" />
            <br />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Object Point x" name="object-x" onChange={updateObject} value={objectPoint[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Object Point y" name="object-y" onChange={updateObject} value={objectPoint[1]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Object Point z" name="object-z" onChange={updateObject} value={objectPoint[2]} variant="outlined" type="number" />
            <br />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Color red" name="color-r" onChange={updateColor} value={color[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Color green" name="color-g" onChange={updateColor} value={color[1]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Color blue" name="color-b" onChange={updateColor} value={color[2]} variant="outlined" type="number" />
            <br />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Coefficient red" name="coefficient-r" onChange={updateCoefficient} value={coefficient[0]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Coefficient green" name="coefficient-g" onChange={updateCoefficient} value={coefficient[1]} variant="outlined" type="number" />
            <TextField sx={{ marginBottom: 2, marginRight: 2, width: 150 }} id="outlined-basic" label="Coefficient blue" name="coefficient-b" onChange={updateCoefficient} value={coefficient[2]} variant="outlined" type="number" />
            <h3>Reflected color</h3>
            <p>({reflectedColor[0]}, {reflectedColor[1]}, {reflectedColor[2]})</p>
            <h3>Visualization</h3>
            <canvas width="500" height="500" id="diffuse-canvas" ref={canvasRef} />
        </div>
    )
}

export default DiffuseLightingPage