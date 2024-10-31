import {ReactElement} from "react";
import {Avatar} from "@mui/material";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import * as React from "react";
import DeveloperIcon from "@icons/developer";
import SchoolIcon from '@mui/icons-material/School';
import DeveloperMonitorIcon from "@icons/developer_monitor";
import DeveloperDeskIcon from "@icons/developer_desk";
import TeacherIcon from "@icons/teacher";
import OldResearcherIcon from "@icons/old_researcher";

export interface Employment {
    start_month: string;
    start_year: number;
    end_month: string;
    end_year?: number;
    title: string;
    employer: string;
    description: string;
    descriptionList?: string[];
    icon?: ReactElement;
}

const SummerInternship: Employment = {

    start_month: "Jun",
    start_year: 2016,
    end_month: "Aug",
    end_year: 2016,
    title: "Summer Intern",
    employer: "BRTRC Federal Solutions",
    description: "Worked as a development team member to extend a .NET desktop application.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <DeveloperIcon fill={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const JuniorDeveloper: Employment = {
    start_month: "Sept",
    start_year: 2016,
    end_month: "Jul",
    end_year: 2020,
    title: "Junior Software Developer",
    employer: "BRTRC Federal Solutions.",
    description: "Worked as a development team member to extend a Geographic Information Systems (GIS) desktop application using Windows Presentation Foundation and C#/.NET",
    descriptionList: [
        "Implemented application GUI & memory-efficient algorithms for processing & displaying GIS data.",
        "Optimized algorithms for creating & displaying user-defined contour lines to produce realistic terrain maps.",
        "Decreased application load time by a factor of five & memory footprint by 70%.",
        "Implemented a system for manipulating, serializing, and viewing 3D models.",
    ],
    icon: (<Avatar style={{width: 45, height: 45}}>
        <DeveloperDeskIcon fill={"#fff"} transform="scale(-1.25, 1.25)"/>
    </Avatar>)
}

const UndergraduateTeachingAssistant: Employment = {
    start_month: "Jan",
    start_year: 2018,
    end_month: "Dec",
    end_year: 2018,
    title: "Undergraduate Teaching Assistant",
    employer: "George Mason University",
    description: "Assisted students with assignments and projects. Held review sessions for exams.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <TeacherIcon fill={"#fff"} transform="scale(1.125, 1.125)"/>
    </Avatar>)
}

const MicrosoftResearchIntern: Employment = {
    start_month: "May",
    start_year: 2022,
    end_month: "Aug",
    end_year: 2022,
    title: "Research Intern",
    employer: "Microsoft Research Lab - Redmond",
    description: "Under the mentorship of Dr. Rodrigo Fonseca, assisted in the design, development, testing, and evaluation of new a microsecond-latency serverless stack.",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <MicrosoftIcon transform="scale(-1.5, 1.5)"/>
    </Avatar>)
}

const UndergraduateResearchAssistant: Employment = {
    start_month: "Jan",
    start_year: 2019,
    end_month: "May",
    end_year: 2020,
    title: "Undergraduate Research Assistant",
    employer: "George Mason University",
    description: "Conducted research under the direction of Dr. Yue Cheng (University of Virginia).",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <DeveloperMonitorIcon fill={"#fff"} transform="scale(1.1, 1.1)"/>
    </Avatar>)
}

const GraduateResearchAssistant: Employment = {
    start_month: "Jun",
    start_year: 2020,
    end_month: "Ongoing",
    title: "Graduate Research Assistant",
    employer: "George Mason University",
    description: "Conducting research under the direction of Dr. Yue Cheng (University of Virginia) and Dr. Songqing Chen (George Mason University).",
    icon: (<Avatar style={{width: 45, height: 45}}>
        <DeveloperMonitorIcon fill={"#fff"} transform="scale(-1.1, 1.1)"/>
    </Avatar>)
}

export const EmploymentHistoryData: Employment[] = [
    // SummerInternship, JuniorDeveloper, UndergraduateTeachingAssistant, MicrosoftResearchIntern, UndergraduateResearchAssistant, GraduateResearchAssistant
    GraduateResearchAssistant, UndergraduateResearchAssistant, MicrosoftResearchIntern, UndergraduateTeachingAssistant, JuniorDeveloper, SummerInternship
];