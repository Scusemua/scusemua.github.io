"use client";
import styles from "@src/styles/components/Awards.module.scss";
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import {Typography, useMediaQuery} from "@mui/material";

import {forwardRef} from "react";
import {AwardData, AwardsData} from "@data/AwardsData";
import theme from "@src/app/theme";
import {Variants, motion} from "framer-motion";
import FramerBox from "@src/components/FramerBox/FramerBox";
import FramerTimelineItem from "@src/components/FramerBox/FramerTimelineContent";
import AwardDisplay from "@src/components/Awards/AwardDisplay";

interface AwardsSectionProps {
}

const AwardsSection = forwardRef<HTMLInputElement, AwardsSectionProps>((_props: AwardsSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));

    const getMaxWidth = () => {
        return (mq_xs || mq_sm) ? "100%" : "85%";
    }

    return (
        <div className={`${styles.awards}`} id="skills" ref={ref} style={{maxWidth: getMaxWidth()}}>
            <Typography variant={"h2"} className={styles.awards_header_text}>
                Awards
            </Typography>
            <Timeline position="alternate" className={styles.awards_timeline}>
                <div className={styles.awards_timeline_background}>
                    {mq_xs && <div style={{paddingTop: "2rem"}}/>}
                    {AwardsData.map((award: AwardData) => <AwardDisplay award={award}/>)}
                </div>
                {mq_xs && <div style={{paddingBottom: "2rem"}}/>}
            </Timeline>
        </div>
    );
});

export default AwardsSection;