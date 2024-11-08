"use client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "./globals.css";

import CssBaseline from '@mui/material/CssBaseline';

import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {Roboto} from 'next/font/google';

import {ThemeProvider, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import React from "react";

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

    const gradientDegrees: string = (mq_xs ? "-89deg" : "90deg");

    return (
        <html lang="en">
        <head>
            <meta name="description" content="Portfolio Website"/>
            <title>Ben Carver</title>
        </head>
        <body className={"solid_background " + roboto.variable}
        style={{
            // background: `linear-gradient(${gradientDegrees}, rgba(63,94,251,1) 0%, rgba(95,90,227,1) 16%, rgba(126,86,203,1) 32%, rgba(158,82,179,1) 48%, rgba(189,78,155,1) 64%, rgba(221,74,131,1) 80%, rgba(252,70,107,1) 100%)` // Blue to Red
            // background: "linear-gradient(90deg, #343434, #2F3061)" // Original
            // background: "linear-gradient(90deg, rgba(45,37,47,1) 0%, rgba(96,67,113,1) 35%, rgba(224,137,208,1) 69%, rgba(107,49,93,1) 100%)" // More purple
        }}>
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <main>
                    {/*<div className="gradient_background" style={{width: "100%", height: "0px", zIndex: -1}}/>*/}
                    {children}
                </main>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

