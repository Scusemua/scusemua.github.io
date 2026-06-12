import * as React from "react";
import { ReactElement, ReactNode } from "react";
import { Avatar, Stack } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import TrophyIcon from "@icons/trophy_icon";
import FellowshipIcon from "@icons/fellowship";
import AwardCertificateIcon from "@icons/award_certificate";
import Typography from "@mui/material/Typography";
import styles from "@styles/components/Awards.module.scss";

export interface AwardData {
  name: string;
  month: string;
  year: number;
  description?: string | ReactNode;
  additionalInfo?: (string | ReactNode)[];
  additionalInfoHeader?: string | ReactNode;
  getIcon: (width: number, height: number, scale?: number) => ReactElement;
}

const DistinguishedAcademicAchievement2020: AwardData = {
  name: "Distinguished Academic Achievement",
  month: "May",
  year: 2020,
  description: "For excellent academic performance.",
  additionalInfoHeader: <b>Courses Taken During Award Period:</b>,
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <TrophyIcon
        fill={"#fff"}
        stroke={"#fff"}
        transform={`scale(${scale || 1.25}, ${scale || 1.25})`}
      />
    </Avatar>
  ),
  additionalInfo: [
    "CS 571 - Operating Systems (Graduate Level)",
    "CS 550 - Database Systems (Graduate Level)",
    "CS 498 - Independent Study in CS (Wukong)",
    "CS 475 - Concurrent & Distributed Systems",
    "CS 465 - Computer Systems Architecture",
    "CS 321 - Software Engineering",
    "CS 306 - Synthesis of Ethics & Law",
  ],
};

const DistinguishedUndergradResearch: AwardData = {
  name: "Distinguished Undergraduate Research",
  month: "May",
  year: 2020,
  description:
    "For outstanding research contributions as an undergraduate student.",
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <AwardCertificateIcon
        fill={"#fff"}
        transform={`scale(${scale || 1.35}, ${scale || 1.35})`}
      />
    </Avatar>
  ),
};

const DistinguishedAcademicAchievement2021: AwardData = {
  name: "Distinguished Academic Achievement",
  month: "May",
  year: 2021,
  description: "For excellent academic performance.",
  additionalInfoHeader: (
    <b>Courses Taken During Award Period (All Graduate Level):</b>
  ),
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <TrophyIcon
        fill={"#fff"}
        stroke={"#fff"}
        transform={`scale(${scale || 1.25}, ${scale || 1.25})`}
      />
    </Avatar>
  ),
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
  ],
};

const GMUPresidentialScholar: AwardData = {
  name: "GMU CS Presidential Scholarship",
  month: "May",
  year: 2021,
  description: (
    <Stack direction={"column"}>
      <Typography>
        Prestigious, merit-based scholarship awarded to at-most 2 students per
        academic year (within a PhD program).
      </Typography>
      <ul style={{ marginLeft: "1.125rem" }}>
        <li key={`presidential-scholarship-award-desc-list-1`}>
          <Typography>Requires a strong faculty nomination.</Typography>
        </li>
        <li key={`presidential-scholarship-award-desc-list-2`}>
          <Typography>
            <b>Renewed annually for 4 years.</b>
          </Typography>
        </li>
      </ul>
    </Stack>
  ),
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <FellowshipIcon
        fill={"#fff"}
        stroke={"#fff"}
        transform={`scale(${scale || 1.5}, ${scale || 1.5})`}
      />
    </Avatar>
  ),
};

const VLDB2023NSFTravelGrant: AwardData = {
  name: "VLDB 2023 NSF Travel Grant",
  month: "Aug",
  year: 2023,
  description: "Funding to attend VLDB 2023 and present a paper.",
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <AirplanemodeActiveIcon
        fill={"#fff"}
        stroke={"#fff"}
        transform={`scale(${scale || 2}, ${scale || 2})`}
      />
    </Avatar>
  ),
};

const DistinguishedAcademicAchievement2026: AwardData = {
  name: "Distinguished Academic Achievement",
  month: "May",
  year: 2026,
  description: "For excellent academic performance.",
  additionalInfoHeader: <b>Courses Taken During Award Period:</b>,
  getIcon: (width: number, height: number, scale?: number) => (
    <Avatar style={{ width: width, height: height }}>
      <TrophyIcon
        fill={"#fff"}
        stroke={"#fff"}
        transform={`scale(${scale || 1.25}, ${scale || 1.25})`}
      />
    </Avatar>
  ),
  additionalInfo: [
    "CS 675 - Distributed Systems",
    "CS 701 - Research Experience in CS",
    "CS 795 - Large Scale Optimization for ML",
    "CS 800 - Computer Science Colloquim",
    "CS 896 - Directed Reading and Research",
    "CS 998 - Doctoral Dissertation Proposal",
    "CS 999 - Doctoral Dissertation",
  ],
};

export const AwardsData: AwardData[] = [
  VLDB2023NSFTravelGrant,
  GMUPresidentialScholar,
  DistinguishedAcademicAchievement2021,
  DistinguishedUndergradResearch,
  DistinguishedAcademicAchievement2020,
  DistinguishedAcademicAchievement2026,
];

// export const AwardsData: AwardData[] = [
//     DistinguishedAcademicAchievement2020,
//     DistinguishedUndergradResearch,
//     DistinguishedAcademicAchievement2021,
//     GMUPresidentialScholar,
//     VLDB2023NSFTravelGrant
// ]
