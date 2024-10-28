'use client';

import React from "react";
import Headshot from "@src/components/Headshot/Headshot";
import Projects from "@src/components/Projects/Projects";
import SkillsSection from "@src/components/Skills/SkillsSection";
import EducationSection from "@src/components/Education/EducationSection";
import CopyrightNotice from "@src/components/Copyright/Copyright";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Home() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        // <Stack direction={'column'} style={{justifyContent: 'center', alignItems: 'center'}} spacing={4}>
        //     <Box sx={{ display: 'flex' }}>
        //         <CircularProgress size={"6rem"} />
        //     </Box>
        //     <Typography variant={"h6"} color={'white'}>Hydrating UI. Please wait.</Typography>
        // </Stack>
        <></>
    );

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
