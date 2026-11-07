import styles from "@src/styles/components/Headshot.module.scss";

import React, {forwardRef} from "react";

import Image from "next/image";

import {PersonalData} from '@data/PersonalData';
import {Stack} from "@mui/material";

import Typography from '@mui/material/Typography';

import SettingsModal from "@src/components/Modals/SettingsModal";
import {TypeAnimation} from "react-type-animation";
import HeaderButtons from "@src/components/Headshot/HeaderButtons";
import SocialLinks from "@src/components/Headshot/SocialLinks";

interface HeaderLayoutProps {
    onClickSettingsButton: () => void;
}

const headerText: string = "Research Scientist at Meta working on AI Network Infrastructure";

const GreetingText: React.FunctionComponent = () => {
    return (<div className={styles.greeting_wrapper}>
        <Stack className={styles.headshot_header_text_greeting} direction={"column"} spacing={1}>
            <div className={styles.greeting_container}>
                <TypeAnimation
                    className={styles.greeting_text_size}
                    sequence={[`Hello, I'm ${PersonalData.name}`]}
                    speed={25}
                    repeat={0}
                />
            </div>
            <Typography variant={"h5"} className={styles.short_desc_text}>{headerText}</Typography>
        </Stack>
        <HeaderButtons/>
    </div>);
}

const UnifiedHeadshotLayout: React.FunctionComponent<HeaderLayoutProps> = (props: HeaderLayoutProps) => {
    return (
        <div key={"xl_layout_headshot"}
             className={styles.headshot_viewport}>
            <div
                className={`${styles.headshot_container} ${styles.headshot_stack} ${styles.headshot_stack_spacing}`}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                }}
            >
                <Stack direction={"column"}>
                    <Image
                        src={PersonalData.image}
                        alt={"Ben's Headshot"}
                        className={`${styles.headshot_container_image} ${styles.headshot_image}`}
                        priority={true}
                    />
                    <SocialLinks onClickSettingsButton={props.onClickSettingsButton}/>
                </Stack>
                <GreetingText/>
            </div>
        </div>
    );
}

const Headshot = forwardRef<HTMLDivElement>((_props, ref) => {
    const [settingsModalOpen, setSettingsModalOpen] = React.useState<boolean>(false);
    const openSettingsModal = React.useCallback(() => setSettingsModalOpen(true), []);
    const closeSettingsModal = React.useCallback(() => setSettingsModalOpen(false), []);

    return (
        <div className={`${styles.headshot} ${styles.headshot_margin}`} ref={ref} key={"headshot_layout_wrapper"}
             style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <UnifiedHeadshotLayout onClickSettingsButton={openSettingsModal}/>
            <SettingsModal open={settingsModalOpen} onClose={closeSettingsModal}/>
        </div>
    );
});

Headshot.displayName = "Headshot";

export default Headshot;