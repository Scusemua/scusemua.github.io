"use client";
import styles from "@src/styles/components/EmploymentHistory.module.scss";
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import {Typography, useMediaQuery} from "@mui/material";

import {forwardRef} from "react";
import {Employment, EmploymentHistoryData} from "@data/EmploymentHistoryData";
import theme from "@src/app/theme";
import EmploymentDisplay from "@src/components/EmploymentHistory/EmploymentDisplay";
import EmploymentDisplaySmall from "@src/components/EmploymentHistory/EmploymentDisplaySmall";

interface EmploymentHistoryProps {
}

const EmploymentHistory = forwardRef<HTMLInputElement, EmploymentHistoryProps>((_props: EmploymentHistoryProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_sm = useMediaQuery(theme.breakpoints.down('sm'));

    const getMaxWidth = () => {
        return (mq_sm) ? "100%" : "90%";
    }

    const getEmploymentDisplay = (employment: Employment, idx: number) => {
        if (mq_sm) {
            return (<EmploymentDisplaySmall key={`employment_display_${employment.title}_${idx}`} employment={employment}/>);
        } else {
            return (<EmploymentDisplay key={`employment_display_${employment.title}_${idx}`} employment={employment}/>);
        }
    }

    return (
        <div className={`${styles.employment}`} id="skills" ref={ref} key={"employment_history_section"} style={{maxWidth: getMaxWidth()}}>
            <Typography variant={"h2"} className={styles.employment_header_text} key={"employment_history_header"}>
                Employment History
            </Typography>
            <Timeline position="right" className={styles.employment_timeline} key={"employment_history_section_timeline"}>
                <div className={styles.employment_timeline_background} key={"employment_history_section_timeline_background"}>
                    {mq_sm && <div style={{paddingTop: "2rem"}}/>}
                    {EmploymentHistoryData.map((employment: Employment, idx: number) => getEmploymentDisplay(employment, idx))}
                </div>
                {mq_sm && <div style={{paddingBottom: "2rem"}} key={"employment_history_section_timeline_padding_bottom"}/>}
            </Timeline>
        </div>
    );
});

export default EmploymentHistory;