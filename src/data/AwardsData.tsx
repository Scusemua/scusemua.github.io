import {ReactNode} from "react";

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {Avatar} from "@mui/material";
import * as React from "react";

export interface AwardData {
    name: string;
    date: string;
    description?: string;
    icon?: ReactNode;
}

const DistinguishedAcademicAchievement2020: AwardData = {
    name: "Distinguished Academic Achievement",
    date: "May 2020",
    description: "For excellent academic performance (i.e., maintaining a 4.0 GPA)."
}

const DistinguishedUndergradResearch: AwardData = {
    name: "Distinguished Undergraduate Research",
    date: "May 2020",
    description: "For outstanding research contributions as an undergraduate student (i.e., publishing a paper).",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <EmojiEventsIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const DistinguishedAcademicAchievement2021: AwardData = {
    name: "Distinguished Academic Achievement",
    date: "May 2020",
    description: "For excellent academic performance (i.e., maintaining a 4.0 GPA)."
}

const GMUPresidentialScholar: AwardData = {
    name: "George Mason University Presidential Scholarship",
    date: "May 2021",
    description: "Prestigious scholarship awarded to at-most 2 new PhD students per academic year (within a given PhD program). Awards are merit-based and require a strong faculty nomination.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <EmojiEventsIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const VLDB2023NSFTravelGrant: AwardData = {
    name: "VLDB 2023 NSF Travel Grant",
    date: "August 2023",
    description: "Funding to attend VLDB 2023 and give a paper presentation at the conference."
}

export const AwardsData: AwardData[] = [
    DistinguishedAcademicAchievement2020,
    DistinguishedUndergradResearch,
    DistinguishedAcademicAchievement2021,
    GMUPresidentialScholar,
    VLDB2023NSFTravelGrant
]