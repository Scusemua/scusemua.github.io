"use client";
import styles from "@src/styles/components/EmploymentHistory.module.scss";
import * as React from 'react';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import {Button, Collapse, Typography, useMediaQuery} from "@mui/material";

import {Employment} from "@data/EmploymentHistoryData";
import theme from "@src/app/theme";
import FramerTimelineItem from "@src/components/FramerBox/FramerTimelineContent";
import {ReactNode} from "react";

interface EmploymentDisplayProps {
    employment: Employment;
}

const contentVariant = {
    hidden: {y: -10, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.75,
        },
    }
}

const EmploymentDisplay: React.FunctionComponent<EmploymentDisplayProps> = (props: EmploymentDisplayProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));

    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <FramerTimelineItem
            className={styles.employment_timeline_entry}
            key={`motion-div-wrapper-props.employment-${props.employment.title}`}
            variants={contentVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 1.0, margin: (mq_xs ? "-5px" : "-25px")}}
            onViewportEnter={() => console.log("Education Section has entered viewport")}
        >
            <TimelineOppositeContent
                key={`motion-div-wrapper-props.employment-${props.employment.title}-content-opposite`}
                sx={{
                    typography: {xs: 'body1', sm: 'h6', md: "h6", lg: "h6", xl: "h6"},
                    margin: "auto 0",
                }}
                align="right"
                color="secondary"
            >
                {props.employment.start_month}, {props.employment.start_year} - {props.employment.end_month}{props.employment.end_year && `, ${props.employment.end_year}`}
            </TimelineOppositeContent>
            <TimelineSeparator
                key={`motion-div-wrapper-props.employment-${props.employment.title}-separator`}>
                <TimelineConnector
                    key={`motion-div-wrapper-props.employment-${props.employment.title}-connector1`}/>
                <TimelineDot
                    key={`motion-div-wrapper-props.employment-${props.employment.title}-dot`}>
                    {props.employment.icon || <FastfoodIcon/>}
                </TimelineDot>
                <TimelineConnector
                    key={`motion-div-wrapper-props.employment-${props.employment.title}-connector2`}/>
            </TimelineSeparator>
            <TimelineContent
                key={`motion-div-wrapper-props.employment-${props.employment.title}-content`}>
                <Typography sx={{typography: {xs: 'body1', sm: 'h5', md: "h5", lg: "h4", xl: "h4"}}}
                            className={styles.employment_timeline_entry_title}>
                    {props.employment.title}
                </Typography>
                <Typography sx={{typography: {xs: 'body2', sm: 'h6', md: "h6", lg: "h5", xl: "h5"}}}
                            className={styles.employment_timeline_entry_employer}>
                    {props.employment.employer}
                </Typography>
                {!mq_xs && !mq_sm &&
                    <Typography variant="body1"
                                className={styles.employment_timeline_entry_description}>
                        {props.employment.description}
                    </Typography>}
                {!mq_xs && !mq_sm && <Collapse
                    in={expanded}
                    timeout={"auto"}
                    unmountOnExit
                >
                    <ul style={{color: "white"}}>
                        {props.employment.descriptionList?.map((entry: string | ReactNode, idx: number) =>
                            <li key={`employment-desc-list-${idx}`}>
                                <Typography variant="body2" key={`employment-desc-list-${idx}-typography`}
                                            className={styles.employment_timeline_entry_description}>
                                    {entry}
                                </Typography>
                            </li>
                        )}
                    </ul>
                </Collapse>}
                {!mq_xs && !mq_sm && props.employment.descriptionList && props.employment.descriptionList.length > 0 &&
                    <Button variant={"text"} style={{color: "#d5e3e3", paddingLeft: 0}} onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Show Less" : "Show More"}
                    </Button>}
            </TimelineContent>
        </FramerTimelineItem>
    );
};
export default EmploymentDisplay;