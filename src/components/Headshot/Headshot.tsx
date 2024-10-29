import styles from "@src/styles/components/Headshot.module.scss";

import React, {forwardRef} from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Box, Button, Card, Stack, Tooltip, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import theme from "@src/app/theme";

interface HeadshotProps {
}

// const Headshot: React.FunctionComponent = () => {
const Headshot = forwardRef<HTMLInputElement, HeadshotProps>((_props: HeadshotProps, ref: React.ForwardedRef<HTMLInputElement>) => {
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
        <Stack direction={"row"} spacing={1} style={{zIndex: 2, justifyContent: "center", alignItems: "center"}}>
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
    )

    const getHeadshotImage = (width: number | `${number}` | undefined = 320) => (
        <Image
            className={styles.headshot_container_image}
            src={PersonalData.image}
            alt={"Ben's Headshot"}
            width={width}
            // style={{ width: '50%', height: 'auto'}}
        />
    );

    const getHeaderGreetingText = (addBreak: boolean, nameTextVariant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1") => {
        return (<div className={styles.headshot_header_text_greeting}>
            <Typography variant={"h5"}>Hello! I am</Typography>
            <Typography variant={nameTextVariant}>{PersonalData.name}</Typography>
            {addBreak &&
                <Typography variant={"h5"}>Computer Science PhD Candidate<br/>at George Mason University</Typography>}
            {!addBreak &&
                <Typography variant={"h5"}>Computer Science PhD Candidate at George Mason University</Typography>}
        </div>);
    };

    const headerBioText = (
        <div style={{
            marginTop: '1rem',
        }}>
            <div className={styles.headshot_header_text_bio_container}>
                <div className={styles.headshot_header_text_bio_text}>
                    <Typography variant={"h6"}>
                        I'm a 3rd year PhD candidate in CS at
                        <Box component="span" color={"#49B075"} fontWeight='fontWeightBold'> George Mason
                            University. </Box>
                        My advisors are
                        <Box component="span" fontWeight='fontWeightBold' color={"#ff2022"} fontSize="1.35rem"> Dr. Yue
                            Cheng</Box> (University of Virginia) and
                        <Box component="span" color={"#ff2022"} fontWeight='fontWeightBold' fontSize="1.35rem"> Dr.
                            Songqing
                            Chen </Box>
                        (GMU).
                        My research interests are centered around cloud computing with a focus on serverless
                        computing. Specifically, I'm interested in applications of serverless computing to data
                        analytics/data science, machine learning, file systems, and other areas.
                    </Typography>
                </div>
            </div>
        </div>
    );

    const headerButtons = (
        <Stack className={styles.headshot_cv_button_stack} spacing={2} key={"headshot_header_buttons"}
               direction={{'xs': 'column', 'sm': 'row', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <Button variant={"contained"} color={'primary'} onClick={downloadResume}
                    startIcon={<DownloadIcon/>} style={{height: 45}}>
                Download my Resume
            </Button>
            <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                <Button variant={"contained"} color={'info'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                        rel="noopener noreferrer" startIcon={<MailIcon/>} style={{height: 45}}>
                    Contact Me
                </Button>
            </Tooltip>
        </Stack>
    );

    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getLayoutXs = () => {
        return (
            <div key={"xs_layout_headshot"}>
                <Stack
                    className={styles.headshot_container}
                    direction={{'xs': 'column', 'sm': 'column', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
                    justifyContent={'center'}
                    spacing={2}
                    alignItems={{'xs': 'center', 'sm': 'center', 'md': 'flex-end', 'lg': 'flex-end', 'xl': 'flex-end'}}>
                    <Stack direction={'row'} spacing={1} sx={{justifyContent: 'center', alignItems: 'flex-end', width: "80%", margin: "0 auto"}}>
                        {getHeadshotImage(200)}
                        <div className={styles.headshot_header_text_greeting}>
                            <Typography variant={"h5"}>Hello! I am</Typography>
                            <Typography variant={"h2"}>{PersonalData.name}</Typography>
                        </div>
                    </Stack>
                    <div className={styles.headshot_header_text_greeting_xs}>
                        <Typography variant={"h5"}>Computer Science PhD Candidate<br/>at George Mason
                            University</Typography>
                    </div>
                </Stack>
                {headerBioText}
                <div className={styles.social_links_container}>
                    {socialLinks}
                </div>
            </div>
        );
    }

    const getLayoutSmToMd = () => {
        return (
            <div key={"sm_to_md_layout_headshot"}>
                <Stack
                    className={styles.headshot_container}
                    direction={{'xs': 'column', 'sm': 'column', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
                    justifyContent={'center'}
                    spacing={4}
                    style={{marginTop: '4rem'}}
                    alignItems={{'xs': 'center', 'sm': 'center', 'md': 'flex-end', 'lg': 'flex-end', 'xl': 'flex-end'}}>
                    <Stack direction={'row'} spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Stack
                            direction={"column"}
                            spacing={2}
                            sx={{justifyContent: 'center', alignItems: 'center'}}>
                            {getHeadshotImage(225)}
                            {(mq_sm || mq_md) && <div className={styles.social_links_container}>
                                {socialLinks}
                            </div>}
                        </Stack>
                        {getHeaderGreetingText(true, "h2")}
                    </Stack>
                </Stack>
                {headerBioText}
            </div>
        );
    }

    const getLayoutLg = () => {
        return (
            <div key={"lg_layout_headshot"}>
                <Stack
                    className={styles.headshot_container}
                    direction={{'xs': 'column', 'sm': 'column', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
                    justifyContent={'center'}
                    spacing={4}
                    style={{marginTop: '4rem'}}
                    alignItems={{'xs': 'center', 'sm': 'center', 'md': 'flex-end', 'lg': 'flex-end', 'xl': 'flex-end'}}>
                    <Stack direction={'row'} spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Stack
                            direction={"column"}
                            spacing={2}
                            sx={{justifyContent: 'center', alignItems: 'center'}}
                        >
                            {getHeadshotImage(250)}
                            <div className={styles.social_links_container}>
                                {socialLinks}
                            </div>
                        </Stack>
                        {getHeaderGreetingText(true)}
                    </Stack>
                </Stack>
                {headerBioText}
            </div>
        );
    }

    const getLayoutXL = () => {
        return (
            <div key={"xl_layout_headshot"}>
                <Stack
                    className={styles.headshot_container}
                    direction={{'xs': 'column', 'sm': 'column', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
                    justifyContent={'center'}
                    spacing={1}
                    alignItems={{'xs': 'center', 'sm': 'center', 'md': 'flex-end', 'lg': 'flex-end', 'xl': 'flex-end'}}>
                    <Stack direction={'row'} spacing={1} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Stack
                            direction={"column"}
                            spacing={2}
                            sx={{justifyContent: 'center', alignItems: 'center'}}>
                            {getHeadshotImage(320)}
                            <div className={styles.social_links_container}>
                                {socialLinks}
                            </div>
                        </Stack>
                    </Stack>
                    <Stack
                        direction={"column"}
                        spacing={2}
                        style={{zIndex: 2}}>
                        {getHeaderGreetingText(false)}
                        {headerBioText}
                    </Stack>
                </Stack>
            </div>
        );
    }

    const getTopMargin = () => {
        if (mq_xl) {
            return "2rem";
        } else if (mq_xs) {
            return "4rem";
        } else {
            return "6rem";
        }
    };

    return (
        <div className={styles.headshot} ref={ref} key={"headshot_layout_wrapper"}
             style={{marginTop: getTopMargin(), marginLeft: 'auto', marginRight: 'auto'}}>
            {/*{(!mq_xs && !mq_sm && !mq_md && !mq_lg && !mq_xl) && getLayoutXL()}*/}
            {mq_xl && getLayoutXL()}
            {mq_lg && getLayoutLg()}
            {(mq_sm || mq_md) && getLayoutSmToMd()}
            {mq_xs && getLayoutXs()}
            {headerButtons}
        </div>
    );
});

export default Headshot;