const normalize = (vec: [number, number, number]): [number, number, number] => {
    const normal = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
    return [vec[0] / normal, vec[1] / normal, vec[2] / normal];
}

const dotProduct = (a: [number, number, number], b: [number, number, number]): number => {
    return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
}

const componentMultiply = (a: [number, number, number], b: [number, number, number]): [number, number, number] => {
    return [a[0]*b[0], a[1]*b[1], a[2]*b[2]];
}

const scalarMultiply = (scalar: number, vec: [number, number, number]): [number, number, number] => {
    return [scalar * vec[0], scalar * vec[1], scalar * vec[2]];
}

const diffuse = (lightPoint: [number, number, number], normal: [number, number, number], objectPoint: [number, number, number], color: [number, number, number], coefficient: [number, number, number]): [number, number, number] => {
    const normalizedNormal = normalize(normal);
    const lightDir: [number, number, number] = [lightPoint[0] - objectPoint[0], lightPoint[1] - objectPoint[1], lightPoint[2] - objectPoint[2]];
    const normalizedLightDir = normalize(lightDir);
    const cosPhi = dotProduct(normalizedNormal, normalizedLightDir);
    return componentMultiply(color, scalarMultiply(cosPhi, coefficient));
}

export default diffuse;