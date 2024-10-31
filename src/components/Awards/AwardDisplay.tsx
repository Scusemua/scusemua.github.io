"use client";
import styles from "@src/styles/components/Awards.module.scss";
import * as React from 'react';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {Avatar, Button, Collapse, Typography, useMediaQuery} from "@mui/material";

import theme from "@src/app/theme";
import FramerTimelineItem from "@src/components/FramerBox/FramerTimelineContent";
import {AwardData} from "@data/AwardsData";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {ReactNode} from "react";

interface AwardDisplayProps {
    award: AwardData;
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

const AwardDisplay: React.FunctionComponent<AwardDisplayProps> = (props: AwardDisplayProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));

    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <FramerTimelineItem
            className={styles.awards_timeline_entry}
            key={`motion-div-wrapper-props.award-${props.award.name}_${props.award.date}`}
            variants={contentVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 1.0, margin: (mq_xs ? "-5px" : "-25px")}}
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
                {props.award.date}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector/>
                <TimelineDot>
                    {props.award.icon || (<Avatar style={{width: 45, height: 45}}>
                        <MilitaryTechIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.1, 1.1)"/>
                    </Avatar>)}
                </TimelineDot>
                <TimelineConnector/>
            </TimelineSeparator>
            <TimelineContent>
                <Typography sx={{typography: {xs: 'body1', sm: 'h5', md: "h5", lg: "h4", xl: "h4"}}}
                            className={styles.awards_timeline_entry_title}>
                    {props.award.name}
                </Typography>
                {!mq_xs && !mq_sm &&
                    <Typography variant="body1"
                                className={styles.awards_timeline_entry_description}>
                        {props.award.description}
                    </Typography>}
                {!mq_xs && !mq_sm && <Collapse
                    in={expanded}
                    timeout={"auto"}
                    unmountOnExit
                >
                    <div>
                        {props.award.additionalInfoHeader &&
                            <Typography variant="body2"
                                        key={`award-${props.award.name}-desc-additional-header`}
                                        className={styles.awards_timeline_entry_description}>
                                {props.award.additionalInfoHeader}
                            </Typography>
                        }
                        <ul style={{color: "white"}}>
                            {props.award.additionalInfo?.map((entry: string | ReactNode, idx: number) =>
                                <li key={`award-desc-list-${idx}`}>
                                    <Typography variant="body2"
                                                key={`award-desc-list-${idx}-typography`}
                                                className={styles.awards_timeline_entry_description}>
                                        {entry}
                                    </Typography>
                                </li>)}
                        </ul>
                    </div>
                </Collapse>}
                {!mq_xs && !mq_sm && props.award.additionalInfo && props.award.additionalInfo.length > 0 &&
                    <Button
                        variant={"text"}
                        style={{
                            color: "#d5e3e3",
                            paddingLeft: 0,
                        }}
                        onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Show Less" : "Show More"}
                    </Button>}
            </TimelineContent>
        </FramerTimelineItem>
    );
};
export default AwardDisplay;