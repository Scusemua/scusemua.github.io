export interface Project {
    name: string;
    description: string;
    venue: string | string[];
    repo_url: string;
    project_website_url: string;
    image: string;
    keywords: string[];
    arxiv_links: string[];
    status: 'active' | 'inactive';
}

export const WukongProject: Project = {
    name: "Wukong",
    description: "Wukong is a high-performance and highly scalable locality-aware, serverless workflow and DAG engine. Wukong uses serverless computing to accelerate the execution of DAG-based scientific, linear algebra, machine learning, and data analytics workloads.",
    venue: ["PDSW'19", "SoCC'20"],
    repo_url: "https://github.com/ds2-lab/Wukong/tree/socc2020",
    project_website_url: "https://ds2-lab.github.io/Wukong/",
    image: "images/wukong_logo.png",
    keywords: ["serverless", "dag", "linear algebra"],
    arxiv_links: ["https://arxiv.org/abs/1910.05896", "https://arxiv.org/abs/2010.07268"],
    status: 'inactive',
}

export const InfiniStoreProject: Project = {
    name: "InfiniStore",
    description: "InfiniStore is an elastic, cost-effective, and high-performance object storage built atop ephemeral cloud funtions. Built on top of the InfiniCache codebase, InfiniStore offers automatic elasticity, durability, strong consistency, and high performance.",
    venue: "VLDB'23",
    repo_url: "https://github.com/ds2-lab/infinistore",
    image: "images/infinistore_logo.png",
    project_website_url: "",
    keywords: ["serverless", "object storage", "caching"],
    arxiv_links: ["https://arxiv.org/abs/2209.01496"],
    status: 'inactive',
}

export const LambdaFSProject: Project = {
    name: "λFS",
    description: "λFS is an elastic, scalable, and high-performance metadata service for large-scale distributed file systems (DFSes). λFS uses an elastically-scaled DFS metadata cache atop serverless functions to maximize performance & cost efficiency.",
    venue: "ASPLOS'23",
    repo_url: "https://github.com/ds2-lab/LambdaFS",
    project_website_url: "",
    image: "images/lfs_logo.png",
    keywords: ["serverless", "distributed file systems", "file storage", "metadata"],
    arxiv_links: ["https://arxiv.org/abs/2306.11877"],
    status: 'inactive',
}

export const JupyterNotebookProject: Project = {
    name: "Distributed Jupyter Notebooks",
    description: "I'm working on a Jupyter Notebooks-as-a-Service (NaaS) platform that is optimized for providing maximum interactivity for users.",
    venue: "",
    repo_url: "",
    project_website_url: "",
    image: "images/jupyter_naas.png",
    keywords: ["serverless", "deep learning", "jupyter notebooks", "gpu scheduling"],
    arxiv_links: [],
    status: 'active',
}

export const ProjectData: Project[] = [
    WukongProject, InfiniStoreProject, LambdaFSProject, JupyterNotebookProject
]