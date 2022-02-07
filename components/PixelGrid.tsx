import { Grid, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Matrix } from "./Matrix";

interface IPixelGridProps {
    values: Matrix
    onValueChange?: (index: [number, number], value: number) => void
    readOnly?: boolean
}

const PixelGrid = (props: IPixelGridProps) => {
    const valueChangeFunc = props.onValueChange;
    const notifyValueChange = useCallback((event) => {
        if (!valueChangeFunc) {
            return;
        }
        const rowColSplit = event.target.name.split('.');
        const rowCol = [+rowColSplit[0], +rowColSplit[1]] as [number, number];
        valueChangeFunc(rowCol, +event.target.value);
    }, [valueChangeFunc]);

    const columnCount = useMemo(() => {
        if (props.values.length === 0) {
            return 3;
        }
        return 12 / props.values[0].length;
    }, [props.values]);

    return (
        <>
            {props.values.map((row, rowIndex) => {
                return (
                    <Grid key={rowIndex} container spacing={2} sx={{ marginTop: 1 }}>
                        {row.map((value, colIndex) => {
                            return (
                                <Grid key={`${rowIndex}.${colIndex}`} item>
                                    <TextField InputProps={{ readOnly: props.readOnly !== undefined && props.readOnly ? true : false }} sx={{ width: 100 }} key={`text.${rowIndex}.${colIndex}`} id="outlined-basic" name={`${rowIndex}.${colIndex}`} label={`${rowIndex}.${colIndex}`} value={value} variant="outlined" type="number" onChange={notifyValueChange} />
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            })}
        </>
    )
}

export default PixelGrid;