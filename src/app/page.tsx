'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import SkillsSection from "@src/components/Skills/SkillsSection";

export default function Home() {
    return (
        <div className="solid_background">
            <div className="gradient_background">
                <Headshot />
                <Projects />
                <SkillsSection />
            </div>
        </div>
    );
}
