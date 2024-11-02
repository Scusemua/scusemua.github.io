import * as React from "react";
import {ReactNode} from "react";
import {Avatar} from "@mui/material";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import TrophyIcon from "@icons/trophy_icon";
import FellowshipIcon from "@icons/fellowship";
import AwardCertificateIcon from "@icons/award_certificate";

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
    icon: (<Avatar style={{width: 50, height: 50}}>
        <TrophyIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.25, 1.25)"/>
    </Avatar>),
    additionalInfo: [
        "CS 571 - Operating Systems (Graduate Level)",
        "CS 550 - Database Systems (Graduate Level)",
        "CS 498 - Independent Study in CS (Wukong)",
        "CS 475 - Concurrent & Distributed Systems",
        "CS 465 - Computer Systems Architecture",
        "CS 321 - Software Engineering",
        "CS 306 - Synthesis of Ethics & Law",
    ]
}

const DistinguishedUndergradResearch: AwardData = {
    name: "Distinguished Undergraduate Research",
    date: "May 2020",
    description: "For outstanding research contributions as an undergraduate student.",
    icon: (<Avatar style={{width: 50, height: 50}}>
        <AwardCertificateIcon fill={"#fff"} transform="scale(1.35, 1.35)"/>
    </Avatar>)
}

const DistinguishedAcademicAchievement2021: AwardData = {
    name: "Distinguished Academic Achievement",
    date: "May 2021",
    description: "For excellent academic performance.",
    additionalInfoHeader: <b>Courses Taken During Award Period (All Graduate Level):</b>,
    icon: (<Avatar style={{width: 50, height: 50}}>
        <TrophyIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.25, 1.25)"/>
    </Avatar>),
    additionalInfo: [
        "CS 799 - Master's Thesis",
        "CS 747 - Deep Learning",
        "CS 700 - Research in CS",
        "CS 697 - Independent Reading & Research",
        "CS 687 - Advanced Artificial Intelligence",
        "CS 684 - Graph Algorithms",
        "CS 600 - Theory of Computation",
        "CS 583 - Analysis of Algorithms",
        "CS 580 - Intro Artificial Intelligence",
        "CS 555 - Computer Communication & Networking",
    ]
}

const GMUPresidentialScholar: AwardData = {
    name: "GMU CS Presidential Scholarship",
    date: "May 2021",
    description: "Prestigious, merit-based scholarship awarded to at-most 2 students per academic year (within a PhD program). Requires a strong faculty nomination.",
    icon: (<Avatar style={{width: 50, height: 50}}>
        <FellowshipIcon fill={"#fff"} stroke={"#fff"} transform="scale(1.5, 1.5)"/>
    </Avatar>)
}

const VLDB2023NSFTravelGrant: AwardData = {
    name: "VLDB 2023 NSF Travel Grant",
    date: "August 2023",
    description: "Funding to attend VLDB 2023 and present a paper.",
    icon: (<Avatar style={{width: 50, height: 50}}>
        <AirplanemodeActiveIcon fill={"#fff"} stroke={"#fff"} transform="scale(2, 2)"/>
    </Avatar>)
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