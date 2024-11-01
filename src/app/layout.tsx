"use client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "./globals.css";

import CssBaseline from '@mui/material/CssBaseline';

import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {Roboto} from 'next/font/google';

import {ThemeProvider} from "@mui/material";
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
    return (
        <html lang="en">
        <head>
            <meta name="description" content="Portfolio Website"/>
            <title>Ben Carver</title>
        </head>
        <body className={"solid_background " + roboto.variable}>
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <main>
                    <div className="gradient_background" style={{width: "100%", height: "0px", zIndex: -1}}/>
                    {children}
                </main>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

