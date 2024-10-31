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

interface AwardDisplaySmallProps {
    award: AwardData;
    extraSmall: boolean;
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

const AwardDisplaySmall: React.FunctionComponent<AwardDisplaySmallProps> = (props: AwardDisplaySmallProps) => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const [collapsedAreaBgColor, setCollapsedAreaBgColor] = React.useState<string>("");

    return (
        <FramerTimelineItem
            className={styles.awards_timeline_entry}
            key={`motion-div-wrapper-props.award-${props.award.name}_${props.award.date}`}
            variants={contentVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 1.0, margin: (props.extraSmall ? "-5px" : "-25px")}}
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
                <Collapse
                    in={expanded}
                    timeout={"auto"}
                    onClick={() => setExpanded(!expanded)}
                    onMouseEnter={() => setCollapsedAreaBgColor("rgba(0,0,0,0.11)")}
                    onMouseLeave={() => setCollapsedAreaBgColor("")}
                    style={{cursor: "pointer", backgroundColor: collapsedAreaBgColor}}
                    unmountOnExit
                >
                    <div>
                        <Typography variant="body1"
                                    className={styles.awards_timeline_entry_description}>
                            {props.award.description}
                        </Typography>
                        {props.award.additionalInfoHeader &&
                            <Typography variant="body2"
                                        key={`award-${props.award.name}-desc-additional-header`}
                                        className={styles.awards_timeline_entry_description}>
                                {props.award.additionalInfoHeader}
                            </Typography>
                        }
                        <ul style={{color: "white"}}>
                            {props.award.additionalInfo?.map((entry: string | ReactNode, idx: number) =>
                                <li>
                                    <Typography variant="body2"
                                                key={`award-desc-list-${idx}`}
                                                className={styles.awards_timeline_entry_description}>
                                        {entry}
                                    </Typography>
                                </li>)}
                        </ul>
                    </div>
                </Collapse>
                <Button
                    variant={"text"}
                    style={{
                        color: "#d5e3e3",
                        paddingLeft: 0,
                    }}
                    onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Show Less" : "Show More"}
                </Button>
            </TimelineContent>
        </FramerTimelineItem>
    );
};
export default AwardDisplaySmall;