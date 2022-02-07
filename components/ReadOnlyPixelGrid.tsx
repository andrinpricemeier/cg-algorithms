import { Grid, TextField, ToggleButton } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Matrix } from "./Matrix";
import TogglePixel from "./TogglePixel";

interface IPixelGridProps {
    values: Matrix;
    states: Matrix;  
    onStateChange: (pixel: [number, number], newState: number) => void
}

const ReadOnlyPixelGrid = (props: IPixelGridProps) => {
    const stateChange = props.onStateChange;
    const onStateChange = useCallback((pixel: [number, number], newState: number) => {
        stateChange(pixel, newState);
    }, [stateChange]);

    return (
        <>
            {props.values.map((row, rowIndex) => {
                return (
                    <Grid key={rowIndex} container spacing={0}>
                        {row.map((value, colIndex) => {
                            return (
                                <Grid key={`${rowIndex}.${colIndex}`} item>
                                    <TogglePixel state={props.states[rowIndex][colIndex]} onStateChange={onStateChange} value={value} coord={[rowIndex, colIndex]}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            })}
        </>
    )
}

export default ReadOnlyPixelGrid;