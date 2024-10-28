import styles from "@src/styles/components/Headshot.module.scss";

import React from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Box, Button, Card, Stack, Tooltip} from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';

const Headshot: React.FunctionComponent = () => {
    const openInNewTab = (url: string | URL | undefined) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const downloadResume = () => {
        const link = document.createElement("a");
        link.download = 'CarverBenjamin_Resume.pdf';
        link.href = 'CarverBenjamin_Resume.pdf'
        link.click();
    }

    const socialLinks = (
        <div className={styles.social_links_drop_shadow}>
            <Stack direction={"row"} spacing={1} className={styles.social_links}>
                <Tooltip title={"GitHub"} arrow>
                    <IconButton aria-label={"GitHub"} size="large"
                                onClick={() => openInNewTab('https://github.com/scusemua/')} color={"default"}>
                        <GitHubIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Email Me (bcarver2@gmu.edu)"} arrow>
                    <IconButton size="large" href={'mailto:bcarver2@gmu.edu'}>
                        <MailIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"LinkedIn"} arrow>
                    <IconButton size="large"
                                onClick={() => openInNewTab('https://www.linkedin.com/in/benjamin-carver-30988a1b6/')}>
                        <LinkedInIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"YouTube"} arrow>
                    <IconButton size="large"
                                onClick={() => openInNewTab('https://www.youtube.com/@benrcarver')}>
                        <YouTubeIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Google Scholar"} arrow>
                    <IconButton size="large"
                                onClick={() => openInNewTab('https://scholar.google.com/citations?user=sCOVuPEAAAAJ&hl=en')}>
                        <SchoolIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </div>
    )

    const headshotImage = (
        <Image
            className={styles.headshot_container_image}
            src={PersonalData.img}
            alt={"Ben's Headshot"}
        />
    );

    const headerText = (
        <div className={styles.headshot_header_text_top}>
            <Typography variant={"h5"}>Hello! I am</Typography>
            <Typography variant={"h1"}>Benjamin Carver</Typography>
            <Typography variant={"h5"}>Computer Science PhD Candidate at George Mason University</Typography>
        </div>
    );

    const introText = (
        <div style={{
            marginTop: '1rem',
        }}>
            <div className={styles.headshot_header_text_container} style={{
                width: '55rem',
            }}>
                <div className={styles.headshot_header_text}>
                    <Typography variant={"h6"}>
                        I'm a 3rd year PhD candidate in CS at
                        <Box component="span" color={"#49B075"} fontWeight='fontWeightBold'> George Mason
                            University.</Box>
                        <br/>
                        My advisors are
                        <Box component="span" fontWeight='fontWeightBold' color={"#F05D5E"}> Dr. Yue
                            Cheng</Box> (University of Virginia) and
                        <Box component="span" color={"#F05D5E"} fontWeight='fontWeightBold'> Dr. Songqing
                            Chen </Box>
                        (GMU).
                        <br/>
                        My research interests are centered around cloud computing with a focus on serverless
                        computing. Specifically, I'm interested in applications of serverless computing to data
                        analytics/data
                        science, machine learning, file systems, and other areas.
                    </Typography>
                </div>
            </div>
        </div>
    );

    const headerButtons = (
        <Stack direction={'column'}>
            <Stack className={styles.headshot_cv_button_stack} spacing={2} direction={"row"}
                   sx={{
                       justifyContent: "center",
                       alignItems: "center",
                   }}>
                <Button variant={"contained"} color={'primary'} onClick={downloadResume}
                        startIcon={<DownloadIcon/>}>
                    Download my Resume
                </Button>
                <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                    <Button variant={"contained"} color={'info'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                            rel="noopener noreferrer" startIcon={<MailIcon/>}>
                        Contact Me
                    </Button>
                </Tooltip>
            </Stack>
        </Stack>
    );

    return (
        <div className={styles.headshot}>
            <Stack
                className={styles.headshot_container}
                direction={"row"}
                justifyContent={'center'}
                spacing={4}
                alignItems={'flex-end'}>
                <Stack
                    direction={"column"}
                    spacing={2}>
                    {headerText}
                    {introText}
                </Stack>
                <Stack
                    direction={"column"}
                    spacing={2}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    {headshotImage}
                    <div style={{marginTop: "1rem"}}>
                        {socialLinks}
                    </div>
                </Stack>
            </Stack>
            {headerButtons}
        </div>
    );
};
export default Headshot;