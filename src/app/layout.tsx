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
>
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <main>
                    <div className="gradient_background" style={{width: "100%", zIndex: -1}}/>
                    <div id={mq_xs ? "mobile_stars" : "stars"} style={{zIndex: 2}}/>
                    <div id={mq_xs ? "mobile_stars2" : "stars2"} style={{zIndex: 2}}/>
                    <div id={mq_xs ? "mobile_stars3" : "stars3"} style={{zIndex: 2}}/>
                    {children}
                </main>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

