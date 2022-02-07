import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ITogglePixelProps {
    coord: [number, number];
    value: any;
    state: number;
    onStateChange: (pixel: [number, number], newState: number) => void
}

const TogglePixel = (props: ITogglePixelProps) => {
    const [checkedValue, setCheckedValue] = useState(null);

    const onStateChangeFunc = props.onStateChange;
    const handleChange = useCallback((event: any, newValue: any) => {
        onStateChangeFunc(props.coord, (props.state + 1) % 3);
        if (props.state === 1 && newValue === null) {
            return;
        }
        setCheckedValue(newValue);
    }, [props.state, props.coord, onStateChangeFunc]);

    useEffect(() => {
        if (props.state > 0) {
            setCheckedValue(props.value);
        }
    }, [props.state, props.value]);

    const buttonColor = useMemo(() => {
        if (props.state === 0) {
            return "primary";
        } else if (props.state === 1) {
            return "success";
        } else {
            return "secondary";
        }
    }, [props.state]);

    return (
        <ToggleButtonGroup
            color={buttonColor}
            value={checkedValue}
            exclusive
            onChange={handleChange}
        >
            <ToggleButton className="PixelButton" sx={{ height: 50, width: 50 }} value={props.value}>{props.value}</ToggleButton>
        </ToggleButtonGroup>
    );
}

export default TogglePixel; 