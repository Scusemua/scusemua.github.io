import {ReactNode} from "react";

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {Avatar} from "@mui/material";
import * as React from "react";

export interface AwardData {
    name: string;
    date: string;
    description?: string | ReactNode;
    additionalInfo?: (string | ReactNode)[];
    additionalInfoHeader?: string | ReactNode;
    icon?: ReactNode;
}

const DistinguishedAcademicAchievement2020: AwardData = {
    name: "Distinguished Academic Achievement",
    date: "May 2020",
    description: "For excellent academic performance.",
    additionalInfoHeader: <b>Courses Taken During Award Period:</b>,
    additionalInfo: [
        "CS571 - Operating Systems (Graduate Level)",
        "CS550 - Database Systems (Graduate Level)",
        "CS498 - Independent Study in CS (Wukong)",
        "CS475 - Concurrent & Distributed Systems",
        "CS465 - Computer Systems Architecture",
        "CS321 - Software Engineering",
        "CS306 - Synthesis of Ethics & Law",
    ]
}

const DistinguishedUndergradResearch: AwardData = {
    name: "Distinguished Undergraduate Research",
    date: "May 2020",
    description: "For outstanding research contributions as an undergraduate student.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <EmojiEventsIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const DistinguishedAcademicAchievement2021: AwardData = {
    name: "Distinguished Academic Achievement",
    date: "May 2021",
    description: "For excellent academic performance.",
    additionalInfoHeader: <b>Courses Taken During Award Period (All Graduate Level):</b>,
    additionalInfo: [
        "CS799 - Master's Thesis",
        "CS747 - Deep Learning",
        "CS700 - Research in CS",
        "CS697 - Independent Reading & Research",
        "CS687 - Advanced Artificial Intelligence",
        "CS684 - Graph Algorithms",
        "CS600 - Theory of Computation",
        "CS583 - Analysis of Algorithms",
        "CS580 - Intro Artificial Intelligence",
        "CS555 - Computer Communication & Networking",
    ]
}

const GMUPresidentialScholar: AwardData = {
    name: "GMU CS Presidential Scholarship",
    date: "May 2021",
    description: "Prestigious, merit-based scholarship awarded to at-most 2 students per academic year (within a PhD program). Requires a strong faculty nomination.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <EmojiEventsIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const VLDB2023NSFTravelGrant: AwardData = {
    name: "VLDB 2023 NSF Travel Grant",
    date: "August 2023",
    description: "Funding to attend VLDB 2023 and present a paper."
}

export const AwardsData: AwardData[] = [
    VLDB2023NSFTravelGrant,
    GMUPresidentialScholar,
    DistinguishedAcademicAchievement2021,
    DistinguishedUndergradResearch,
    DistinguishedAcademicAchievement2020,
]

// export const AwardsData: AwardData[] = [
//     DistinguishedAcademicAchievement2020,
//     DistinguishedUndergradResearch,
//     DistinguishedAcademicAchievement2021,
//     GMUPresidentialScholar,
//     VLDB2023NSFTravelGrant
// ]