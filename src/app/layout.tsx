"use client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "./globals.css";
import "./stars.scss";
import "./stars_mobile.scss";

import CssBaseline from '@mui/material/CssBaseline';

import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {Roboto} from 'next/font/google';

import {ThemeProvider, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import React, {Context} from "react";
import {BubbleContext, BubbleProvider, BubbleState} from "@src/providers/BubbleContext";
import {ParallaxProviders} from "@src/providers/ParallaxProvider";
import {SettingsProvider} from "@src/components/Context/SettingsContext";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    return (
        <html lang="en">
        <head>
            <meta name="description" content="Portfolio Website"/>
            <title>Ben Carver</title>
        </head>
        <body
            className={mq_xs ? "solid_background_mobile " + roboto.variable : "solid_background_desktop " + roboto.variable}>
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <ParallaxProviders>
                    <SettingsProvider>
                        <main>
                            {children}
                        </main>
                    </SettingsProvider>
                </ParallaxProviders>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}