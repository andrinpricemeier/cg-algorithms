export type BresenhamComputation = {
    log: string[];
    points: [number, number][]
}

const bresenham = (startPoint: [number, number], endPoint: [number, number]): BresenhamComputation => {
    const log: string[] = [];
    const points: [number, number][] = [];
    const x0 = startPoint[0];
    const y0 = startPoint[1];
    const x1 = endPoint[0];
    const y1 = endPoint[1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const de = 2 * dy;
    const dne = 2*(dy - dx);
    let d = 2*dy-dx;
    let y = y0;
    log.push(`DX = ${dx}`);
    log.push(`DY = ${dy}`);
    log.push(`DE = ${de}`);
    log.push(`DNE = ${dne}`);
    log.push(`d = ${d}`);
    log.push(`(${x0}, ${y0})`);
    points.push([x0, y0]);
    for (let x = x0 + 1; x <= x1; x++) {
        console.log({x});
        if (d <= 0) {
            d = d + de;
        } else {
            d = d + dne;
            y = y + 1;
        }
        log.push(`(${x}, ${y}), d = ${d}`);
        points.push([x, y]);
    }
    return {
        log: log,
        points: points
    }
}

export default bresenham;