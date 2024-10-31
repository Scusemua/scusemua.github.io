"use client";
import styles from "@src/styles/components/EmploymentHistory.module.scss";
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import {List, ListItem, Typography, useMediaQuery} from "@mui/material";

import {forwardRef} from "react";
import {Employment, EmploymentHistoryData} from "@data/EmploymentHistoryData";
import theme from "@src/app/theme";
import {Variants, motion} from "framer-motion";
import FramerBox from "@src/components/FramerBox/FramerBox";
import FramerTimelineItem from "@src/components/FramerBox/FramerTimelineContent";
import EmploymentDisplay from "@src/components/EmploymentHistory/EmploymentDisplay";

interface EmploymentHistoryProps {
}

const EmploymentHistory = forwardRef<HTMLInputElement, EmploymentHistoryProps>((_props: EmploymentHistoryProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_sm = useMediaQuery(theme.breakpoints.down('sm'));

    const getMaxWidth = () => {
        return (mq_sm) ? "100%" : "85%";
    }

    return (
        <div className={`${styles.employment}`} id="skills" ref={ref} key={"employment_history_section"} style={{maxWidth: getMaxWidth()}}>
            <Typography variant={"h2"} className={styles.employment_header_text} key={"employment_history_header"}>
                Employment History
            </Typography>
            <Timeline position="alternate" className={styles.employment_timeline} key={"employment_history_section_timeline"}>
                <div className={styles.employment_timeline_background} key={"employment_history_section_timeline_background"}>
                    {mq_sm && <div style={{paddingTop: "2rem"}}/>}
                    {EmploymentHistoryData.map((employment: Employment, idx: number) => <EmploymentDisplay key={`employment_display_${employment.title}_${idx}`} employment={employment}/>)}
                </div>
                {mq_sm && <div style={{paddingBottom: "2rem"}} key={"employment_history_section_timeline_padding_bottom"}/>}
            </Timeline>
        </div>
    );
});

export default EmploymentHistory;