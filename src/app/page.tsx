'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import Skills from "@src/components/Skills/Skills";

export default function Home() {
    return (
        <div className="solid_background">
            <div className="gradient_background">
                <Headshot />
                <Projects />
                <Skills />
            </div>
        </div>
    );
}
