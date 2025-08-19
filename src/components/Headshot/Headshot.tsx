import styles from "@src/styles/components/Headshot.module.scss";

import React, {forwardRef} from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Button, Stack, Tooltip, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import MouseIcon from '@mui/icons-material/Mouse';
import theme from "@src/app/theme";
import {BubbleContext} from "@src/providers/BubbleContext";
import Link from "next/link";
import {SettingsRounded} from "@mui/icons-material";
import SettingsModal from "@src/components/Modals/SettingsModal";
import Clouds from "@src/components/Effects/Clouds";
import {TypeAnimation} from "react-type-animation";
import Wave from "@src/components/Effects/Wave";

interface HeadshotProps {
}

interface HeaderLayoutProps {
    onClickSettingsButton: () => void;
}

const headerText: string = "Research Scientist at Meta working on AI Network Infrastructure";

const ExtraSmallHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
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
                <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
            </div>
            <div className={styles.headshot_header_text_greeting}>
                <Typography variant={"h2"}>{PersonalData.name}</Typography>
            </div>
            <div className={styles.headshot_header_text_greeting_xs}>
                <Typography variant={"h5"}>
                    {headerText}
                </Typography>
            </div>
            <HeaderBioText mq_xs={true}/>
        </Stack>
    );
}

const SmallHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
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
                        <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                    </div>
                </Stack>
                <div className={styles.headshot_header_text_greeting}>
                    <Typography variant={"h5"}>Hello! I am</Typography>
                    <Typography variant={"h2"}>{PersonalData.name}</Typography>
                    <Typography variant={"h5"}>{headerText}</Typography>
                </div>
            </Stack>
            <div style={{margin: "1rem auto 0 auto", width: "95%"}}>
                <HeaderBioText mq_xs={false}/>
            </div>
        </div>
    );
}

const MediumOrLargeHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
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
                            <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                        </div>
                    </Stack>
                    <div className={styles.headshot_header_text_greeting}>
                        <Typography variant={"h5"}>Hello! I am</Typography>
                        <Typography variant={"h1"}>{PersonalData.name}</Typography>
                        <Typography variant={"h4"}>{headerText}</Typography>
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

    const viewResume = () => {
        window.open('CarverBenjamin_Resume.pdf');
    }

    return (
        <Stack className={styles.headshot_cv_button_stack} spacing={2} key={"headshot_header_buttons"}
               direction={{'xs': 'column', 'sm': 'row', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <Tooltip title={"View a PDF copy of my resume"} arrow>
                <Button variant={"contained"} color={'secondary'} onClick={viewResume}
                        startIcon={<DownloadIcon style={{color: "#322364"}}/>} style={{height: 45, width: "16rem"}}
                        aria-label={"View my Resume Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem", color: "#322364"}}>
                        View my Resume
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                <Button variant={"contained"} color={'primary'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                        rel="noopener noreferrer" startIcon={<MailIcon style={{color: "white"}}/>}
                        style={{height: 45, width: "12rem"}}
                        aria-label={"Contact Me Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem", color: "white"}}>
                        Contact Me
                    </Typography>
                </Button>
            </Tooltip>
            {/*<Tooltip title={"View the website's source code on GitHub"} arrow>*/}
            {/*    <Button href={"https://github.com/Scusemua/scusemua.github.io"} startIcon={<GitHubIcon/>}*/}
            {/*            variant={"contained"}*/}
            {/*            component={Link}*/}
            {/*            style={{height: 45, width: "12rem"}} color={'info'}>*/}
            {/*        <Typography variant={"button"} align={"center"} style={{fontSize: "1rem"}}>*/}
            {/*            Source Code*/}
            {/*        </Typography>*/}
            {/*    </Button>*/}
            {/*</Tooltip>*/}
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

const ExtraLargeHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
    return (
        <div key={"xl_layout_headshot"}
             style={{height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
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
                        <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
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
                        <Typography variant={"h5"} style={{fontSize: "1.7rem"}}>{headerText}</Typography>
                    </div>
                    <div style={{width: "86%", margin: "0 auto"}}>
                        <HeaderBioText mq_xs={false}/>
                    </div>
                    <HeaderButtons/>
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
            {/*<Typography variant={"h1"} style={{fontSize: props.mq_xs ? "1.5rem" : "1.7rem"}} align={"left"}>*/}
            {/*    <Info/> About Me*/}
            {/*</Typography>*/}
            <Typography variant={"h6"} style={{fontSize: props.mq_xs ? "1.2rem" : "1.5rem"}} align={"justify"}>
                I received my PhD in computer science from George Mason University in August, 2025. I was a member of
                the <a href={"https://ds2-lab.github.io/"}>DS<sup>2</sup> lab</a> at the University of Virginia
                (UVA). My advisors were Dr. Yue Cheng (UVA) & Dr. Songqing Chen (GMU). My research has
                focused on developing unique and innovative applications of cloud and serverless computing to a
                wide variety of domains, including data analytics, machine learning, file systems, and more.
                In August of 2025, I will be joining Meta as a Research Scientist working on AI network infrastructure.
            </Typography>
        </div>
    </div>);
}

interface SocialLinksProps {
    onClickSettingsButton: () => void;
}

const SocialLinks: React.FunctionComponent<SocialLinksProps> = (props: SocialLinksProps) => {
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

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
                        href={'https://www.linkedin.com/in/benjamin-carver-phd-30988a1b6/'}>
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
        {mq_xl && <Tooltip title={"Settings"} arrow>
            <IconButton size="large" onClick={props.onClickSettingsButton}>
                <SettingsRounded fontSize="inherit"/>
            </IconButton>
        </Tooltip>}
    </Stack>);
}

const UnifiedHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getGreetingTextSize = () => {
        if (mq_xl) {
            return "7rem";
        }

        if (mq_lg) {
            return "5rem";
        }

        if (mq_md) {
            return "5rem";
        }

        return "4rem";
    }

    const getSpacing = () => {
        if (mq_xl) {
            return 4;
        }

        if (mq_lg) {
            return 0;
        }

        return 0;
    }

    const getImageWidth = () => {
        if (mq_xl || mq_lg) {
            return "24rem";
        }

        return "16rem";
    }

    return (
        <div key={"xl_layout_headshot"}
             style={{
                 height: "100vh",
                 width: "100%",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 margin: "0 auto",
             }}>
            <Stack
                className={styles.headshot_container}
                direction={mq_xl || mq_lg ? 'row' : 'column'}
                justifyContent={'center'}
                alignContent={"center"}
                alignItems={'center'}
                spacing={getSpacing()}
            >
                <div>
                    <div>
                        <Image
                            src={PersonalData.image}
                            alt={"Ben's Headshot"}
                            className={styles.headshot_container_image}
                            style={{width: getImageWidth(), height: "auto"}}
                            priority={true}
                        />
                    </div>
                    <div className={styles.social_links_container}>
                        <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                    </div>
                </div>
                <div style={{width: "1100px"}}>
                    <div className={styles.headshot_header_text_greeting}>
                        <TypeAnimation
                            sequence={[`Hello, I'm ${PersonalData.name}`]}
                            speed={25}
                            style={{fontSize: getGreetingTextSize()}}
                            repeat={0}
                        />
                        <Typography variant={"h5"} style={{fontSize: "2rem"}}>{headerText}</Typography>
                    </div>
                    <HeaderButtons/>
                </div>
            </Stack>
        </div>
    );
}

// const Headshot: React.FunctionComponent = () => {
const Headshot = forwardRef<HTMLInputElement, HeadshotProps>((_props: HeadshotProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [settingsModalOpen, setSettingsModalOpen] = React.useState<boolean>(false);

    const getTopMargin = () => {
        if (mq_xl) {
            return "0rem";
        } else if (mq_xs) {
            return "4rem";
        } else {
            return "2rem";
        }
    };

    return (
        <div className={styles.headshot} ref={ref} key={"headshot_layout_wrapper"}
             style={{marginTop: getTopMargin(), marginLeft: 'auto', marginRight: 'auto'}}>
            <UnifiedHeadshotLayout onClickSettingsButton={() => setSettingsModalOpen(true)}/>
            <SettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)}/>
        </div>
    );
});

export default Headshot;