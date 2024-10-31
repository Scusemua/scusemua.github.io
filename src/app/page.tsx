'use client';

import React, {LegacyRef} from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import SkillsSection from "@src/components/Skills/SkillsSection";
import EducationSection from "@src/components/Education/EducationSection";
import CopyrightNotice from "@src/components/Copyright/Copyright";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Navbar from "@src/components/Navbar/Navbar";
import EmploymentHistory from "@src/components/EmploymentHistory/EmploymentHistory";
import AwardsSection from "@src/components/Awards/AwardsSection";

export default function Home() {
    const headshotRef = React.useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
    const projectRef = React.useRef<HTMLInputElement>(null);
    const employmentRef = React.useRef<HTMLInputElement>(null);
    const educationRef = React.useRef<HTMLInputElement>(null);
    const skillsRef = React.useRef<HTMLInputElement>(null);
    const awardRef = React.useRef<HTMLInputElement>(null);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <></>
    );

    return (
        <div>
            {/*<div style={{width: "100%", height: "0px", zIndex: -1}} className="gradient_background"/>*/}
            <Navbar headshotRef={headshotRef} educationRef={educationRef} projectRef={projectRef}
                    skillsRef={skillsRef} employmentHistoryRef={employmentRef} awardRef={awardRef} key={"navbar"}/>
            <Headshot ref={headshotRef} key={"headshot_section"}/>
            <Projects ref={projectRef} key={"projects_section"}/>
            <AwardsSection ref={awardRef} key={"awardsSection"}/>
            <EducationSection ref={educationRef} key={"education_section"}/>
            <EmploymentHistory ref={employmentRef} key={"employment_section"}/>
            <SkillsSection ref={skillsRef} key={"skills_section"}/>
            <CopyrightNotice key={"copyright_section"}/>
        </div>
    );
}
