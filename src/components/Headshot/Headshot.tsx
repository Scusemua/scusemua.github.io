import styles from "@src/styles/components/Headshot.module.scss";

import React, {forwardRef} from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Box, Button, Stack, Tooltip, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import theme from "@src/app/theme";
import {BubbleContext} from "@src/providers/BubbleContext";
import Link from "next/link";

interface HeadshotProps {
}

const ExtraSmallHeadshotLayout: React.FunctionComponent = () => {
    return (
        <Stack
            className={styles.headshot_container}
            direction={'column'}
            justifyContent={'center'}
            spacing={3}
            alignItems={'center'}
            key={"xs_layout_headshot"}
            style={{
                width: "90%"
            }}
        >
            <Image
                src={PersonalData.image}
                alt={"Ben's Headshot"}
                className={styles.headshot_container_image}
                style={{marginTop: "2rem", width: "60%", height: "auto"}}
                priority={true}
            />
            <div className={styles.social_links_container}>
                <SocialLinks/>
            </div>
            <div className={styles.headshot_header_text_greeting}>
                <Typography variant={"h2"}>{PersonalData.name}</Typography>
            </div>
            <div className={styles.headshot_header_text_greeting_xs}>
                <Typography variant={"h5"}>
                    Computer Science
                    <br/>PhD Candidate
                    <br/>at George Mason
                    University
                </Typography>
            </div>
            <HeaderBioText mq_xs={true}/>
        </Stack>
    );
}

const SmallHeadshotLayout: React.FunctionComponent = () => {
    return (
        <div key={"lg_layout_headshot"} style={{margin: "0 auto"}}>
            <Stack
                className={styles.headshot_container}
                direction={'row'}
                justifyContent={'center'}
                spacing={4}
                style={{
                    marginTop: '4rem',
                    width: "90%",
                }}
                alignItems={'center'}>
                <Stack
                    direction={"column"}
                    spacing={2}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Image
                        src={PersonalData.image}
                        alt={"Ben's Headshot"}
                        className={styles.headshot_container_image}
                        style={{width: "16rem", height: "auto"}}
                        priority={true}
                    />
                    <div className={styles.social_links_container}>
                        <SocialLinks/>
                    </div>
                </Stack>
                <div className={styles.headshot_header_text_greeting}>
                    <Typography variant={"h5"}>Hello! I am</Typography>
                    <Typography variant={"h2"}>{PersonalData.name}</Typography>
                    <Typography variant={"h5"}>Computer Science<br/>PhD Candidate<br/>at George Mason
                        University</Typography>
                </div>
            </Stack>
            <div style={{margin: "1rem auto 0 auto", width: "95%"}}>
                <HeaderBioText mq_xs={false}/>
            </div>
        </div>
    );
}

const MediumOrLargeHeadshotLayout: React.FunctionComponent = () => {
    return (
        <div key={"lg_layout_headshot"}>
            <Stack
                className={styles.headshot_container}
                direction={'row'}
                justifyContent={'center'}
                spacing={4}
                style={{marginTop: '4rem'}}
                alignItems={'flex-end'}>
                <Stack
                    direction={'row'}
                    spacing={8}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Stack
                        direction={"column"}
                        spacing={2}
                        sx={{justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                            src={PersonalData.image}
                            alt={"Ben's Headshot"}
                            className={styles.headshot_container_image}
                            style={{width: "16rem", height: "auto"}}
                            priority={true}
                        />
                        <div className={styles.social_links_container}>
                            <SocialLinks/>
                        </div>
                    </Stack>
                    <div className={styles.headshot_header_text_greeting}>
                        <Typography variant={"h5"}>Hello! I am</Typography>
                        <Typography variant={"h1"}>{PersonalData.name}</Typography>
                        <Typography variant={"h4"}>Computer Science<br/>PhD Candidate at<br/>George Mason
                            University</Typography>
                    </div>
                </Stack>
            </Stack>
            <div style={{margin: "1rem auto 0 auto", width: "88%"}}>
                <HeaderBioText mq_xs={false}/>
            </div>
        </div>
    );
}

const HeaderButtons: React.FunctionComponent = () => {
    const downloadResume = () => {
        const link = document.createElement("a");
        link.download = 'CarverBenjamin_Resume.pdf';
        link.href = 'CarverBenjamin_Resume.pdf'
        link.click();
    }

    return (
        <Stack className={styles.headshot_cv_button_stack} spacing={2} key={"headshot_header_buttons"}
               direction={{'xs': 'column', 'sm': 'row', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <Tooltip title={"Download a PDF copy of my resume"} arrow>
                <Button variant={"contained"} color={'primary'} onClick={downloadResume}
                        startIcon={<DownloadIcon/>} style={{height: 45, width: "16rem"}}
                        aria-label={"Download my Resume Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem"}}>
                        Download my Resume
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                <Button variant={"contained"} color={'info'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                        rel="noopener noreferrer" startIcon={<MailIcon/>} style={{height: 45, width: "12rem"}}
                        aria-label={"Contact Me Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem"}}>
                        Contact Me
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"View the website's source code on GitHub"} arrow>
                <Button href={"https://github.com/Scusemua/scusemua.github.io"} startIcon={<GitHubIcon/>}
                        variant={"contained"}
                        component={Link}
                        style={{height: 45, width: "12rem"}} color={'secondary'}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem"}}>
                        Source Code
                    </Typography>
                </Button>
            </Tooltip>
            {/*<Tooltip title={"Toggle the \"bubbles\" in the background on/off. This button is just for development/testing and will not stick around long-term!"} arrow>*/}
            {/*    <Button variant={"contained"} color={'secondary'} onClick={() => setBubblesEnabled(!bubblesEnabled)}*/}
            {/*            startIcon={<BubbleChart/>} style={{height: 45, width: "12rem"}}*/}
            {/*            aria-label={"Contact Me Button"}>*/}
            {/*        <Typography variant={"button"} align={"center"} style={{fontSize: "1rem"}}>*/}
            {/*            Toggle Bubbles*/}
            {/*        </Typography>*/}
            {/*    </Button>*/}
            {/*</Tooltip>*/}
        </Stack>
    );
}

const ExtraLargeHeadshotLayout: React.FunctionComponent = () => {
    return (
        <div key={"xl_layout_headshot"}>
            <Stack
                className={styles.headshot_container}
                direction={'row'}
                justifyContent={'center'}
                alignContent={"center"}
                alignItems={'flex-end'}
                style={{
                    margin: '0 auto'
                }}
                spacing={1}
            >
                <Stack
                    direction={"column"}
                    spacing={4}
                    justifyContent={'center'}
                    alignItems={'center'}
                    paddingTop={'5rem'}
                >
                    <div>
                        <Image
                            src={PersonalData.image}
                            alt={"Ben's Headshot"}
                            className={styles.headshot_container_image}
                            width={376}
                            priority={true}
                        />
                    </div>
                    <div className={styles.social_links_container}>
                        <SocialLinks/>
                    </div>
                </Stack>
                <Stack
                    direction={"column"}
                    spacing={0}
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignContent={"center"}
                    style={{
                        zIndex: 2,
                        paddingTop: "5rem",
                        width: "60%"
                    }}
                >
                    <div className={styles.headshot_header_text_greeting}>
                        <Typography variant={"h4"}>Hello! I am</Typography>
                        <Typography variant={"h1"}>{PersonalData.name}</Typography>
                        <Typography variant={"h5"} style={{fontSize: "1.7rem"}}>Computer Science PhD Candidate at
                            George Mason
                            University</Typography>
                    </div>
                    <div style={{width: "86%", margin: "0 auto"}}>
                        <HeaderBioText mq_xs={false}/>
                    </div>
                    <div><HeaderButtons/></div>
                </Stack>
            </Stack>
        </div>
    );
}

interface HeaderBioTextProps {
    mq_xs: boolean;
}

const HeaderBioText: React.FunctionComponent<HeaderBioTextProps> = (props: HeaderBioTextProps) => {
    return (<div
        style={{
            margin: '1rem auto 0 auto',
        }}
        className={styles.headshot_header_text_bio_container}
    >
        <div className={styles.headshot_header_text_bio_text}>
            <Typography variant={"h6"} style={{fontSize: props.mq_xs ? "1.2rem" : "1.5rem"}}>
                I'm a 4th year computer science PhD student at George Mason University and a member of
                the <a href={"https://ds2-lab.github.io/"}>DS<sup>2</sup> lab</a> at the University of Virginia
                (UVA).
                My advisors are Dr. Yue Cheng (UVA) & Dr. Songqing Chen (GMU). My research is
                focused on developing unique and innovative applications of cloud and serverless computing to a
                wide variety of domains, including data analytics, machine learning, file systems, and more.
            </Typography>
        </div>
    </div>);
}

const SocialLinks: React.FunctionComponent = () => {
    return (<Stack direction={"row"} spacing={1} style={{zIndex: 2, justifyContent: "center", alignItems: "center"}}>
        <Tooltip title={"GitHub"} arrow>
            <IconButton aria-label={"GitHub"} size="large" component={Link}
                        href={'https://github.com/scusemua/'} color={"default"}>
                <GitHubIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Tooltip title={"Email Me (bcarver2@gmu.edu)"} arrow>
            <IconButton size="large" href={'mailto:bcarver2@gmu.edu'} component={Link}>
                <MailIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Tooltip title={"LinkedIn"} arrow>
            <IconButton size="large" component={Link}
                        href={'https://www.linkedin.com/in/benjamin-carver-30988a1b6/'}>
                <LinkedInIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Tooltip title={"YouTube"} arrow>
            <IconButton size="large" component={Link}
                        href={'https://www.youtube.com/@benrcarver'}>
                <YouTubeIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Tooltip title={"Google Scholar"} arrow>
            <IconButton size="large" component={Link}
                        href={'https://scholar.google.com/citations?user=sCOVuPEAAAAJ&hl=en'}>
                <SchoolIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
    </Stack>);
}

// const Headshot: React.FunctionComponent = () => {
const Headshot = forwardRef<HTMLInputElement, HeadshotProps>((_props: HeadshotProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const {bubblesEnabled, setBubblesEnabled} = React.useContext(BubbleContext);

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
            {mq_xl && <ExtraLargeHeadshotLayout/>}
            {(mq_md || mq_lg) && <MediumOrLargeHeadshotLayout/>}
            {mq_sm && <SmallHeadshotLayout/>}
            {mq_xs && <ExtraSmallHeadshotLayout/>}
            {!mq_xl && <HeaderButtons/>}
        </div>
    );
});

export default Headshot;