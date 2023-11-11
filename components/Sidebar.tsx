import Box from "@mui/material/Box";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
    const router = useRouter();

    const urlLookup = useMemo(() => {
        const lookup = {} as any;
        lookup["0"] = "/";
        lookup["2"] = "/halftone/dispersed-dot-dithering";
        lookup["3"] = "/halftone/error-diffusion";
        lookup["5"] = "/scanline-conversion/bresenham";
        lookup["6"] = "/scanline-conversion/floodfill";
        lookup["8"] = "/clipping/cohen-sutherland";
        lookup["11"] = "/lighting/diffuse";
        lookup["12"] = "/lighting/specular";
        return lookup;
    }, []);

    const onItemSelected = useCallback((event: React.SyntheticEvent, nodeIds: Array<string> | string) => {
        let nodeId;
        if (Array.isArray(nodeIds)) {
            nodeId = nodeIds.join("");
        } else {
            nodeId = nodeIds as string;
        }
        if (nodeId in urlLookup) {
            router.push(urlLookup[nodeId]);
        }
    }, [urlLookup, router]);

    return (
        <Box position="static">
            <TreeView
                aria-label="Sidebar Menu"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ maxWidth: "300px" }}
                onNodeSelect={onItemSelected}
            >
                <TreeItem nodeId="0" label="Home" />
                <TreeItem nodeId="1" label="Halftone">
                    <TreeItem nodeId="2" label="Dispersed Dot Dithering" />
                    <TreeItem nodeId="3" label="Error Diffusion" />
                </TreeItem>
                <TreeItem nodeId="4" label="Scanline Conversion">
                    <TreeItem nodeId="5" label="Bresenham" />
                    <TreeItem nodeId="6" label="Floodfill" />
                </TreeItem>
                <TreeItem nodeId="7" label="Clipping">
                    <TreeItem nodeId="8" label="Cohen Sutherland" />
                </TreeItem>
                <TreeItem nodeId="9" label="Lighting">
                    <TreeItem nodeId="11" label="Diffuse" />
                    <TreeItem nodeId="12" label="Specular" />
                </TreeItem>
            </TreeView>
        </Box>
    )
}

export default Sidebar;