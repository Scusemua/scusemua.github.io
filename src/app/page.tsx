'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Navbar from "@src/components/HomepageNavbar/HomepageNavbar";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";

// Lazy-load below-the-fold sections so the initial bundle stays small
// and the headshot + navbar paint without waiting on heavier components.
const AboutSection = React.lazy(() => import("@src/components/About/About"));
const Projects = React.lazy(() => import("@src/components/Projects/Projects"));
const AwardsSection = React.lazy(() => import("@src/components/Awards/AwardsSection"));
const EducationSection = React.lazy(() => import("@src/components/Education/EducationSection"));
const EmploymentHistory = React.lazy(() => import("@src/components/EmploymentHistory/EmploymentHistory"));
const SkillsSection = React.lazy(() => import("@src/components/Skills/SkillsSection"));
const CopyrightNotice = React.lazy(() => import("@src/components/Copyright/Copyright"));
const Clouds = React.lazy(() => import("@src/components/Effects/Clouds"));

const rootStyle: React.CSSProperties = {position: 'relative'};
const skillsWrapperStyle: React.CSSProperties = {position: "relative"};
const cloudsStyle: React.CSSProperties = {position: "absolute", bottom: 0, left: 0};

export default function Home() {
    const headshotRef = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
    const aboutRef = React.useRef<HTMLDivElement>(null);
    const projectRef = React.useRef<HTMLDivElement>(null);
    const employmentRef = React.useRef<HTMLDivElement>(null);
    const educationRef = React.useRef<HTMLDivElement>(null);
    const skillsRef = React.useRef<HTMLDivElement>(null);
    const awardRef = React.useRef<HTMLDivElement>(null);

    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));

    // Gate entrance animations behind a mount flag so SSR-rendered HTML
    // starts invisible ("pre-mount") and sections stagger in only after
    // hydration, preventing a flash of unstyled content.
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const s = (n: number) => mounted ? `stagger-in stagger-in-${n}` : 'pre-mount';
    const sFade = (n: number) => mounted ? `stagger-fade stagger-in-${n}` : 'pre-mount';

    return (
        <div style={rootStyle}>
            {!mounted && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        border: '3px solid rgba(255,255,255,0.15)',
                        borderTopColor: 'rgba(255,255,255,0.7)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                </div>
            )}
            <div className={sFade(1)} style={{position: 'relative', zIndex: 1100}}>
                <Navbar headshotRef={headshotRef} educationRef={educationRef} projectRef={projectRef}
                        skillsRef={skillsRef} employmentHistoryRef={employmentRef} awardRef={awardRef} key={"navbar"}/>
            </div>
            <div className={s(2)}>
                <Headshot ref={headshotRef} key={"headshot_section"}/>
            </div>
            {/* Reserve scroll space while lazy sections load to prevent layout shift */}
            <React.Suspense fallback={<div style={{minHeight: '400vh'}} />}>
                <div className={s(3)}>
                    <AboutSection ref={aboutRef} key={"about_section"} projectSectionRef={projectRef}/>
                </div>
                <div className={s(4)}>
                    <Projects ref={projectRef} key={"projects_section"}/>
                </div>
                <div className={s(5)}>
                    <AwardsSection ref={awardRef} key={"awardsSection"}/>
                </div>
                <div className={s(6)}>
                    <EducationSection ref={educationRef} key={"education_section"}/>
                </div>
                <div className={s(7)}>
                    <EmploymentHistory ref={employmentRef} key={"employment_section"}/>
                </div>
                <div className={s(8)} style={skillsWrapperStyle}>
                    <SkillsSection ref={skillsRef} key={"skills_section"} is_xs={mq_xs}/>
                </div>
                <div className={s(9)}>
                    <CopyrightNotice key={"copyright_section"}/>
                </div>
                <Clouds flipped style={cloudsStyle}/>
            </React.Suspense>
        </div>
    );
}
