import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    useColorScheme,
} from "@mui/material/styles";

const defaultTheme = extendTheme();

// primary: {
//     // main: "#01082c",
//     main: "#00121a",
//     // main: "#012231"
// },
// secondary: {
//     main: "#1876d2",
// },
// custom: {
//     main: "#babbbd",
// },

const theme = extendTheme({
    // Override or create new styles, colors, palettes...
    palette: {
        // text: {
        //     primary: "#ffffff",
        //     // secondary: "#ff0000",
        // },
        primary: {
            // light: will be calculated from palette.primary.main,
            // main: "#16213E",
            main: "#00121a"
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            // light: "#0066ff",
            // main: "#0F3460",
            main: "#013754"
            // dark: will be calculated from palette.secondary.main,
            // contrastText: "#ffcc00",
        },
        custom: {
            // light: "#ffa726",
            main: "#E94560",
            // dark: "#ef6c00",
            // contrastText: "#000000",
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

const ModeSwitcher = () => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // for server-side rendering
        // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
        return null;
    }

    return (
        <Button
            variant="outlined"
            onClick={() => {
                if (mode === "light") {
                    setMode("dark");
                } else {
                    setMode("light");
                }
            }}
        >
            {mode === "light" ? "Dark" : "Light"}
        </Button>
    );
};

const CustomTheme = (props) => {
    return (
        <CssVarsProvider theme={theme}>
            {/* <ModeSwitcher /> */}
            {props.children}
        </CssVarsProvider>
    );
};

export default CustomTheme;
