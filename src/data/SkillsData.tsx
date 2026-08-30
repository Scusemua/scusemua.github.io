import React, { ReactElement } from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import BuildIcon from "@mui/icons-material/Build";
import TerminalIcon from "@mui/icons-material/Terminal";
import SchoolIcon from "@mui/icons-material/School";
import MemoryIcon from "@mui/icons-material/Memory";

export enum SkillCategory {
  HighPerformanceComputing = "GPU & High-Performance Computing",
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

export const HighPerformanceComputingSkills: Skills = {
  category: SkillCategory.HighPerformanceComputing,
  icon: <MemoryIcon fontSize={"inherit"} style={{ fontSize: "24pt" }} />,
  skills: [
    "Collective Communication",
    "NCCL",
    "CUDA",
    "GPU Kernel Development",
    "Distributed Training",
    "{{break}}",
    "RDMA",
    "IBGDA",
    "NVLink (NVL) & NVLS",
    "Multi-Node GPU Clusters",
    "{{break}}",
    "Performance Engineering",
    "Performance Regression Testing",
    "Benchmarking & Profiling",
    "Nsight Systems (nsys/ncu)",
  ],
};

export const CloudPlatformSkills: Skills = {
  category: SkillCategory.Platforms,
  icon: <CloudIcon fontSize={"inherit"} style={{ fontSize: "24pt" }} />,
  skills: [
    "Google Cloud Platform",
    "Azure Cloud",
    "Amazon Web Services",
    "IBM Cloud",
    "{{break}}",
    "EC2",
    "ECS",
    "EKS",
    "GKE",
    "Lambda",
    "S3",
    "VPC",
    "IAM",
    "Fargate",
  ],
};

export const ToolSkills: Skills = {
  category: SkillCategory.Tools,
  icon: <BuildIcon fontSize={"inherit"} style={{ fontSize: "24pt" }} />,
  skills: [
    "Docker",
    "Kubernetes",
    "Docker Compose",
    "Docker Swarm",
    "MySQL Cluster NDB",
    "Visual Studio",
    "Ansible",
    "Prometheus",
    "IntelliJ",
    "WebStorm",
    "Grafana",
    "Traefik",
    "Goland",
    "Promtail",
    "Linux",
    "HDFS",
    "Loki",
    "Redis",
    "MySQL",
    "PyTorch",
    "CMake",
    "Git",
  ],
};

export const ProgrammingLanguagesSkills: Skills = {
  category: SkillCategory.Languages,
  icon: <TerminalIcon fontSize={"inherit"} style={{ fontSize: "24pt" }} />,
  skills: [
    "C++",
    "CUDA C++",
    "C",
    "Python",
    "Golang",
    "JavaScript/TypeScript",
    "Java",
    "C#",
    "SQL",
  ],
};

export const RelevantCoursework: Skills = {
  category: SkillCategory.Coursework,
  icon: <SchoolIcon fontSize={"inherit"} style={{ fontSize: "24pt" }} />,
  skills: [
    "Large-Scale Optimization for Deep Learning",
    "Advanced Artificial Intelligence",
    "Concurrent & Distributed Systems",
    "Object Oriented Software Design",
    "Artificial Intelligence",
    "Computer Architecture",
    "Systems Programming",
    "Distributed Systems",
    "Mobile Development",
    "Operating Systems",
    "Computer Networks",
    "Programming in C",
    "Machine Learning",
    "Graph Algorithms",
    "Data Structures",
    "Convex Analysis",
    "Linear Algebra",
    "Data Analytics",
    "Deep Learning",
    "Algorithms",
    "Databases",
    "Compilers",
  ],
};

export const SkillsData: Skills[] = [
  HighPerformanceComputingSkills,
  CloudPlatformSkills,
  ToolSkills,
  ProgrammingLanguagesSkills,
  RelevantCoursework,
];
