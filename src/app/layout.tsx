"use client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "./globals.css";

import CssBaseline from '@mui/material/CssBaseline';

import AppRouterCacheProvider from '@mui/material-nextjs/v13-appRouter/appRouterV13';
import {Roboto} from 'next/font/google';

import theme from "@src/app/theme";
import React from "react";
import {ThemeProvider, useMediaQuery} from "@mui/material";

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

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <></>
    );

    return (
        <html lang="en">
        <head>
            <meta name="description" content="Portfolio Website"/>
            <title>Ben Carver</title>
        </head>
        <body id={"body"} className={roboto.variable}>
        <AppRouterCacheProvider>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <main>
                    {/*<div className="gradient_background" style={{width: "100%", height: "0px", zIndex: -1}}/>*/}
                    <div id={"root"} style={{
                        background: `linear-gradient(${gradientDegrees}, rgba(63,94,251,1) 0%, rgba(95,90,227,1) 16%, rgba(126,86,203,1) 32%, rgba(158,82,179,1) 48%, rgba(189,78,155,1) 64%, rgba(221,74,131,1) 80%, rgba(252,70,107,1) 100%)`,
                        filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#3f5efb\",endColorstr=\"#fc466b\",GradientType=1)",
                    }}>
                        {children}
                    </div>
                </main>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

