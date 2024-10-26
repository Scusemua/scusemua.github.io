"use client";

import type {Metadata} from "next";
import "./globals.css";

import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {Roboto} from 'next/font/google';

import * as React from 'react';
import {ThemeProvider} from "@mui/material";
import theme from "@src/app/theme";



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
            <ThemeProvider theme={theme}>
                <main>
                    {children}
                </main>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

