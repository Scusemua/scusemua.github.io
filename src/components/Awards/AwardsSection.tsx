"use client";
import styles from "@src/styles/components/Awards.module.scss";
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import {Typography, useMediaQuery} from "@mui/material";

import {forwardRef} from "react";
import {AwardData, AwardsData} from "@data/AwardsData";
import theme from "@src/app/theme";
import AwardDisplay from "@src/components/Awards/AwardDisplay";
import AwardDisplaySmall from "@src/components/Awards/AwardDisplaySmall";

interface AwardsSectionProps {
}

const AwardsSectionComponent = forwardRef<HTMLInputElement, AwardsSectionProps>((_props: AwardsSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));

    const getMaxWidth = () => {
        return (mq_xs || mq_sm) ? "100%" : "90%";
    }

    const getAwardDisplay = (award: AwardData) => {
        if (mq_xs || mq_sm) {
            return (<AwardDisplaySmall extraSmall={mq_xs} key={`award_${award.name}_${award.date}_component`} award={award}/>);
        } else {
            return (<AwardDisplay key={`award_${award.name}_${award.date}_component`} award={award}/>);
        }
    }

    return (
        <div className={`${styles.awards}`} id="skills" ref={ref} style={{maxWidth: getMaxWidth()}} key={"awards_section_wrapper"}>
            <Typography variant={"h2"} className={styles.awards_header_text} key={"awards_section_header"}>
                Awards
            </Typography>
            <Timeline position="right" className={styles.awards_timeline} key={"awards_section_timeline"}>
                <div className={styles.awards_timeline_background} key={"awards_section_timeline_content_wrapper"}>
                    {mq_xs && <div style={{paddingTop: "2rem"}}/>}
                    {AwardsData.map((award: AwardData) => getAwardDisplay(award))}
                </div>
                {mq_xs && <div style={{paddingBottom: "2rem"}}/>}
            </Timeline>
        </div>
    );
});

export default AwardsSectionComponent;