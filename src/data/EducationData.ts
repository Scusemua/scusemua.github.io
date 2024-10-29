export interface AdvisorInfo {
    name: string;
    institution: string;
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
}

export const AllDegreeInfo: DegreeInfo[] = [ BachelorsDegree, MastersDegree, DoctoralDegree]