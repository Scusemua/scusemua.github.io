export enum SkillCategory {
    Platforms = "Cloud Platforms",
    Tools = "Tools & Software",
    Languages = "Programming Languages",
    Coursework = "Relevant Coursework",
}

export interface Skills {
    category: SkillCategory;
    skills: string[];
}

export const CloudPlatformSkills: Skills = {
    category: SkillCategory.Platforms,
    skills: ["Amazon Web Services", "Google Cloud Platform", "Azure Cloud", "IBM Cloud", "EC2", "ECS", "EKS", "GKE", "IAM"]
}

export const ToolSkills: Skills = {
    category: SkillCategory.Tools,
    skills: ["Docker", "Docker Compose", "Docker Swarm", "Kubernetes", "Grafana", "Loki/Promtail", "Prometheus", "Kafka", "Traefik", "Visual Studio", "IntelliJ", "Eclipse", "YourKit Profiler", "RedGate Profilers", "Goland", "WebStorm", "Linux", "Windows"]
}

export const ProgrammingLanguagesSkills: Skills = {
    category: SkillCategory.Languages,
    skills: ["Java", "Golang", "Python", "C++", "C", "C#", "JavaScript/TypeScript"]
}

export const RelevantCoursework: Skills = {
    category: SkillCategory.Coursework,
    skills: ["C Programming", "Linear Algebra", "Data Structures", "Operating Systems", "Database Systems", "Computer Architecture", "Algorithms", "Systems Programming", "Compilers", "Object Oriented Software Design", "Machine Learning", "Artificial Intelligence", "Advanced Artificial Intelligence", "Graph Algorithms", "Deep Learning", "Data Analytics", "Mobile Development", "Large-Scale Optimization for Deep Learning", "Distributed Systems,", "Convex Analysis & Theory of Deep Learning", "Concurrent and Distributed Systems."]
}

export const SkillsData: Skills[] = [
    CloudPlatformSkills, ToolSkills, ProgrammingLanguagesSkills, RelevantCoursework
]