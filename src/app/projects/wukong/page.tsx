'use client';

import React from "react";
import {Fab} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import Link from "next/link";

export default function WukongPage() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <></>
    );

    return (
        <div id="wukong-content" style={{
            overflow: "hidden",
        }}>
            <Fab color="info" aria-label="go back" style={{
                margin: 0,
                top: 'auto',
                right: "10%",
                bottom: "5%",
                left: 'auto',
                position: 'fixed',
            }} component={Link} href={"/"}>
                <ArrowBack/>
            </Fab>
            <iframe
                id={"wukong_website_iframe"}
                title={"Wukong Website"}
                src="https://ds2-lab.github.io/Wukong/"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </div>
    );
}
