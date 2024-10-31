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

interface EmploymentHistoryProps {
}

const contentVariant = {
    hidden: {y: -10, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

const EmploymentHistory = forwardRef<HTMLInputElement, EmploymentHistoryProps>((_props: EmploymentHistoryProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));

    const getTimelineContent = (employment: Employment) => {
        return (
            <FramerTimelineItem
                className={styles.employment_timeline_entry}
                key={`motion-div-wrapper-employment-${employment.title}`}
                variants={contentVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 1.0, margin: (mq_xs ? "-5px" : "-15px")}}
                onViewportEnter={() => console.log("Education Section has entered viewport")}
            >
                <TimelineOppositeContent
                    sx={{
                        typography: {xs: 'body1', sm: 'h6', md: "h6", lg: "h6", xl: "h6"},
                        margin: "auto 0",
                    }}
                    align="right"
                    color="secondary"
                >
                    {employment.start_month}, {employment.start_year} - {employment.end_month}{employment.end_year && `, ${employment.end_year}`}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector/>
                    <TimelineDot>
                        {employment.icon || <FastfoodIcon/>}
                    </TimelineDot>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography sx={{typography: {xs: 'body1', sm: 'h5', md: "h5", lg: "h4", xl: "h4"}}}
                                className={styles.employment_timeline_entry_title}>
                        {employment.title}
                    </Typography>
                    <Typography sx={{typography: {xs: 'body2', sm: 'h6', md: "h6", lg: "h5", xl: "h5"}}}
                                className={styles.employment_timeline_entry_employer}>
                        {employment.employer}
                    </Typography>
                    {!mq_xs && !mq_sm &&
                        <Typography variant="body1"
                                    className={styles.employment_timeline_entry_description}>
                            {employment.description}
                        </Typography>}
                </TimelineContent>
            </FramerTimelineItem>
        );
    }

    const getMaxWidth = () => {
        return (mq_xs || mq_sm) ? "100%" : "85%";
    }

    return (
        <div className={`${styles.employment}`} id="skills" ref={ref} style={{maxWidth: getMaxWidth()}}>
            <Typography variant={"h2"} className={styles.employment_header_text}>
                Employment History
            </Typography>
            <Timeline position="alternate" className={styles.employment_timeline}>
                <div className={styles.employment_timeline_background}>
                    {mq_xs && <div style={{paddingTop: "2rem"}}/>}
                    {EmploymentHistoryData.map((employment: Employment) => {
                        return getTimelineContent(employment);
                    })}
                </div>
                {mq_xs && <div style={{paddingBottom: "2rem"}}/>}
            </Timeline>
        </div>
    );
});

export default EmploymentHistory;