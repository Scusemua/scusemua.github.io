'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import SkillsSection from "@src/components/Skills/SkillsSection";
import EducationSection from "@src/components/Education/EducationSection";
import CopyrightNotice from "@src/components/Copyright/Copyright";
import Navbar from "@src/components/HomepageNavbar/HomepageNavbar";
import EmploymentHistory from "@src/components/EmploymentHistory/EmploymentHistory";
import AwardsSection from "@src/components/Awards/AwardsSection";
import Clouds from "@src/components/Effects/Clouds";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import AboutSection from "@src/components/About/About";

export default function Home() {
    const headshotRef = React.useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
    const aboutRef = React.useRef<HTMLInputElement>(null);
    const projectRef = React.useRef<HTMLInputElement>(null);
    const employmentRef = React.useRef<HTMLInputElement>(null);
    const educationRef = React.useRef<HTMLInputElement>(null);
    const skillsRef = React.useRef<HTMLInputElement>(null);
    const awardRef = React.useRef<HTMLInputElement>(null);

    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <></>
    );

    return (
        <div style={{position: 'relative'}}>
            <Navbar headshotRef={headshotRef} educationRef={educationRef} projectRef={projectRef}
                    skillsRef={skillsRef} employmentHistoryRef={employmentRef} awardRef={awardRef} key={"navbar"}/>
            <Headshot ref={headshotRef} key={"headshot_section"}/>
            <AboutSection ref={aboutRef} key={"about_section"}/>
            <Projects ref={projectRef} key={"projects_section"}/>
            <AwardsSection ref={awardRef} key={"awardsSection"}/>
            <EducationSection ref={educationRef} key={"education_section"}/>
            <EmploymentHistory ref={employmentRef} key={"employment_section"}/>
            <div style={{
                position: "relative",
            }}><SkillsSection ref={skillsRef} key={"skills_section"} is_xs={mq_xs}/></div>
            <CopyrightNotice key={"copyright_section"}/>
            <Clouds flipped style={{
                position: "absolute",
                bottom: 0,
                left: 0,
            }}/>
        </div>
    );
}
