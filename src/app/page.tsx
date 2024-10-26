'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import {Metadata} from "next";
import Projects from "@src/components/Projects/Projects";

export default function Home() {
    return (
        <div className="solid_background">
            <div className="gradient_background">
                <Headshot />
                <Projects />
            </div>
        </div>
    );
}
