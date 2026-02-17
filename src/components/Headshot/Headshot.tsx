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

interface HeaderLayoutProps {
    onClickSettingsButton: () => void;
}

const headerText: string = "Research Scientist at Meta working on AI Network Infrastructure";

const GreetingText: React.FunctionComponent = () => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
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
        <Stack className={styles.headshot_header_text_greeting} direction={"column"} spacing={1}>
            <div style={{height: mq_xs ? "100px" : "auto"}}>
                <TypeAnimation
                    sequence={[`Hello, I'm ${PersonalData.name}`]}
                    speed={25}
                    style={{fontSize: getGreetingTextSize(), lineHeight: "1"}}
                    repeat={0}
                />
            </div>
            <Typography variant={"h5"} style={{fontSize: getShortDescTextSize()}}>{headerText}</Typography>
        </Stack>
        <HeaderButtons/>
    </div>);
}

const UnifiedHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getSpacing = () => {
        if (mq_xs) {
            return 0;
        }

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
                    <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                </Stack>
                <GreetingText/>
            </Stack>
        </div>
    );
}

// const Headshot: React.FunctionComponent = () => {
const Headshot = forwardRef<HTMLDivElement>((_props, ref) => {
    // const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [settingsModalOpen, setSettingsModalOpen] = React.useState<boolean>(false);

    const getTopMargin = () => {
        if (mq_xl || mq_lg) {
            return "1.5rem";
        }

        if (mq_md) {
            return "1.5rem";
        }

        if (mq_sm) {
            return "2.5rem";
        }

        return "3rem"
    };

    return (
        <div className={styles.headshot} ref={ref} key={"headshot_layout_wrapper"}
             style={{marginTop: getTopMargin(), marginLeft: 'auto', marginRight: 'auto'}}>
            <UnifiedHeadshotLayout onClickSettingsButton={() => setSettingsModalOpen(true)}/>
            <SettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)}/>
        </div>
    );
});

Headshot.displayName = "Headshot";

export default Headshot;