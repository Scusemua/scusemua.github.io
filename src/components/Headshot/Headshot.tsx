import styles from "@src/styles/components/Headshot.module.scss";

import React, {forwardRef} from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Stack, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';

import theme from "@src/app/theme";
import SettingsModal from "@src/components/Modals/SettingsModal";
import {TypeAnimation} from "react-type-animation";
import HeaderButtons from "@src/components/Headshot/HeaderButtons";
import SocialLinks from "@src/components/Headshot/SocialLinks";

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

const GreetingText: React.FunctionComponent = () => {
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
            return "3.5rem";
        }

        return "3rem";
    }

    const getWidth = () => {
        if (mq_xl || mq_lg) {
            return "100%";
        }

        if (mq_md) {
            return "100%";
        }

        return "350px";
    }

    const getShortDescTextSize = () => {
        if (mq_xl || mq_lg) {
            return "2rem";
        }

        return "1.25rem";
    }

    return (<div style={{width: getWidth()}}>
        <div className={styles.headshot_header_text_greeting}>
            <div style={{height: mq_md || mq_lg || mq_xl ? "auto" : "150px"}}>
                <TypeAnimation
                    sequence={[`Hello, I'm ${PersonalData.name}`]}
                    speed={25}
                    style={{fontSize: getGreetingTextSize(), lineHeight: "1"}}
                    repeat={0}
                />
            </div>
            <Typography variant={"h5"} style={{fontSize: getShortDescTextSize()}}>{headerText}</Typography>
        </div>
        <HeaderButtons/>
    </div>);
}

const UnifiedHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getSpacing = () => {
        return 4;
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
                direction={mq_xl || mq_lg || mq_md ? 'row' : 'column'}
                justifyContent={'center'}
                alignContent={"center"}
                alignItems={'center'}
                spacing={getSpacing()}
                sx={{margin: "0 auto"}}
            >
                <Stack direction={"column"}>
                    <Image
                        src={PersonalData.image}
                        alt={"Ben's Headshot"}
                        className={styles.headshot_container_image}
                        style={{width: getImageWidth(), height: "auto", marginBottom: "1rem"}}
                        priority={true}
                    />
                    <div className={styles.social_links_container}>
                        <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                    </div>
                </Stack>
                <GreetingText/>
            </Stack>
        </div>
    );
}

// const Headshot: React.FunctionComponent = () => {
const Headshot = forwardRef<HTMLInputElement, HeadshotProps>((_props: HeadshotProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    // const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    // const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [settingsModalOpen, setSettingsModalOpen] = React.useState<boolean>(false);

    const getTopMargin = () => {
        if (mq_xl || mq_lg || mq_md) {
            return "1.5rem";
        }

        return "2.5rem"
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