'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import SkillsSection from "@src/components/Skills/SkillsSection";
import EducationSection from "@src/components/Education/EducationSection";
import CopyrightNotice from "@src/components/Copyright/Copyright";

export default function Home() {
    return (
        <div>
            <div style={{width: "100%", height: "0px", zIndex: -1}} className="gradient_background">
            </div>
            <Headshot/>
            <Projects/>
            <EducationSection/>
            <SkillsSection/>
            <CopyrightNotice/>
        </div>
    );
}
