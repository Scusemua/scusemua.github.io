import React, {ReactElement} from "react";
import CloudIcon from '@mui/icons-material/Cloud';
import BuildIcon from '@mui/icons-material/Build';
import TerminalIcon from '@mui/icons-material/Terminal';
import SchoolIcon from '@mui/icons-material/School';

export enum SkillCategory {
    Platforms = "Cloud Platforms",
    Tools = "Tools & Software",
    Languages = "Programming Languages",
    Coursework = "Relevant Coursework",
}

export interface Skills {
    category: SkillCategory;
    skills: string[];
    icon: ReactElement;
}

export const CloudPlatformSkills: Skills = {
    category: SkillCategory.Platforms,
    icon: <CloudIcon fontSize={"inherit"} style={{fontSize: "24pt"}}/>,
    skills: ["Amazon Web Services", "Google Cloud Platform", "Azure Cloud", "IBM Cloud", "EC2", "ECS", "EKS", "GKE"]
}

export const ToolSkills: Skills = {
    category: SkillCategory.Tools,
    icon: <BuildIcon fontSize={"inherit"} style={{fontSize: "24pt"}}/>,
    skills: ["Docker", "Docker Compose", "Docker Swarm", "Kubernetes", "Grafana", "Loki/Promtail", "Prometheus", "Kafka", "Traefik", "Visual Studio", "IntelliJ", "YourKit Profiler", "RedGate Profilers", "Goland", "WebStorm", "Linux"]
}

export const ProgrammingLanguagesSkills: Skills = {
    category: SkillCategory.Languages,
    icon: <TerminalIcon fontSize={"inherit"} style={{fontSize: "24pt"}}/>,
    skills: ["Java", "Golang", "Python", "C++", "C", "C#", "JavaScript/TypeScript"]
}

export const RelevantCoursework: Skills = {
    category: SkillCategory.Coursework,
    icon: <SchoolIcon fontSize={"inherit"} style={{fontSize: "24pt"}}/>,
    skills: ["Programming in C", "Linear Algebra", "Data Structures", "Operating Systems", "Databases", "Computer Architecture", "Algorithms", "Systems Programming", "Compilers", "Object Oriented Software Design", "Machine Learning", "Artificial Intelligence", "Advanced Artificial Intelligence", "Graph Algorithms", "Deep Learning", "Data Analytics", "Mobile Development", "Convex Analysis", "Large-Scale Optimization for Deep Learning", "Distributed Systems", "Concurrent & Distributed Systems"]
}

export const SkillsData: Skills[] = [
    CloudPlatformSkills, ToolSkills, ProgrammingLanguagesSkills, RelevantCoursework
]