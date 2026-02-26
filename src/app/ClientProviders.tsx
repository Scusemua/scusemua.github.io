"use client";

import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {ThemeProvider} from "@mui/material";
import theme from "@src/app/theme";
import React from "react";
import {SettingsProvider} from "@src/components/Context/SettingsContext";

export default function ClientProviders({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <SettingsProvider>
                    <main>
                        {children}
                    </main>
                </SettingsProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
