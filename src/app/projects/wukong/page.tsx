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
import Navbar from "@src/components/HomepageNavbar/HomepageNavbar";
import EmploymentHistory from "@src/components/EmploymentHistory/EmploymentHistory";
import AwardsSection from "@src/components/Awards/AwardsSection";

export default function Home() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <></>
    );

    return (
        <div id="wukong-content">
            <iframe width="100%" height="100%" src="https://ds2-lab.github.io/Wukong/"></iframe>
        </div>
    );
}
