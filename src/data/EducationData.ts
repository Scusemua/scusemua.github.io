export interface AdvisorInfo {
    name: string;
    institution: string;
}

export interface CourseInfo {
    name: string;
    term: string;
    grade: string;
}

export interface DegreeInfo {
    degree: string;
    subject: string;
    institution: string;
    gpa: number;
    startDate: number | string;
    endDate: number | string;
    hasThesis: boolean;
    thesisTitle?: string;
    thesisUrl?: string;
    thesisFile?: string;
    thesisKind?: string;
    researchAdvisors: AdvisorInfo[];
    coursework?: CourseInfo[];
    phase?: string;
}

const YueCheng: AdvisorInfo = {
    name: "Dr. Yue Cheng",
    institution: "University of Virginia",
}

const SongqingChen: AdvisorInfo = {
    name: "Dr. Songqing Chen",
    institution: "George Mason University",
}

export const BachelorsDegree: DegreeInfo = {
    degree: "Bachelor of Science",
    institution: "George Mason University",
    subject: "Computer Science",
    researchAdvisors: [YueCheng],
    gpa: 4.0,
    startDate: 2016,
    endDate: 2020,
    hasThesis: false,
    coursework: [
        { "name": "CS 571: Operating Systems", "grade": "A", "term": "Spring 2019"},
        { "name": "CS 550: Database Systems", "grade": "A", "term": "Fall 2019"},
        { "name": "CS 498: Granular Microservice Frameworks", "grade": "A", "term": "Spring 2019"},
        { "name": "CS 484: Data Mining", "grade": "A", "term": "Spring 2019"},
        { "name": "CS 475: Concurrent & Distributed Systems", "grade": "A", "term": "Fall 2019"},
        { "name": "CS 465: Computer Systems Architecture", "grade": "A", "term": "Spring 2019"},
        { "name": "CS 440: Language Processors & Programming Environments (Compilers)", "grade": "A", "term": "Spring 2019"},
        { "name": "CS 321: Software Engineering", "grade": "A", "term": "Fall 2019"},
    ]
}

export const MastersDegree: DegreeInfo = {
    degree: "Master of Science",
    institution: "George Mason University",
    subject: "Computer Science",
    gpa: 4.0,
    startDate: 2020,
    endDate: 2021,
    researchAdvisors: [YueCheng],
    thesisTitle: "Wukong: A Fast, Cost-Effective, and Easy-to-Use Serverless DAG Engine",
    thesisUrl: "https://hdl.handle.net/1920/12093",
    thesisFile: "CarverBenjamin_MastersThesis.pdf",
    thesisKind: "Thesis",
    hasThesis: true,
    coursework: [
        { "name": "CS 687: Advanced Artificial Intelligence", "grade": "A", "term": "Spring 2021"},
        { "name": "CS 684: Graph Algorithms", "grade": "A", "term": "Spring 2021"},
        { "name": "CS 555: Computer Communication & Networking", "grade": "A", "term": "Fall 2020"},
        { "name": "CS 580: Intro to Artificial Intelligence", "grade": "A", "term": "Fall 2020"},
        { "name": "CS 583: Analysis of Algorithms", "grade": "A", "term": "Fall 2020"},
    ]
}

export const DoctoralDegree: DegreeInfo = {
    degree: "Doctor of Philosophy (PhD)",
    institution: "George Mason University",
    subject: "Computer Science",
    researchAdvisors: [YueCheng, SongqingChen],
    gpa: 4.0,
    phase: "Candidacy",
    startDate: 2021,
    endDate: "2025 (Estimated)",
    thesisKind: "Dissertation",
    thesisTitle: "Towards Elastic, Stateful Serverless Systems",
    hasThesis: true,
    coursework: [
        { "name": "CS 795: Large Scale Optimization for Machine Learning", "grade": "A", "term": "Spring 2022"},
        { "name": "CS 675: Distributed Systems", "grade": "A", "term": "Spring 2022"},
        { "name": "CS 747: Deep Learning", "grade": "A", "term": "Fall 2021"},
        { "name": "CS 600: Theory of Computation", "grade": "A", "term": "Fall 2021"},
    ]
}

export const AllDegreeInfo: DegreeInfo[] = [ DoctoralDegree, MastersDegree, BachelorsDegree]