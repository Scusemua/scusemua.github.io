import wukong_logo from "@images/logos/wukong_logo.webp";
import infinistore_logo from "@images/logos/infinistore_logo.webp";
import obliv_inf_store_logo from "@images/logos/oblivious_infinistore_logo.webp";
import lfs_logo from "@images/logos/lambda_fs_logo.webp";
import jupyter_naas from "@images/logos/jupyter_naas_logo.webp";
import faas_platform_logo from "@images/logos/faas_platforms_logo.webp";

export interface Project {
    name: string;
    description: string;
    venue: string | string[];
    repo_url: string;
    project_website_url: string;
    image: string;
    keywords: string[];
    arxiv_links: string[];
    builtWith?: string[];
    status: 'ongoing' | 'inactive';
}

export const WukongProject: Project = {
    name: "Wukong",
    description: "Wukong is a high-performance and highly scalable locality-aware, serverless DAG engine. Wukong uses FaaS to accelerate the execution of linear algebra, machine learning, and data analytics workloads.",
    venue: ["PDSW'19", "SoCC'20"],
    repo_url: "https://github.com/ds2-lab/Wukong/tree/socc2020",
    project_website_url: "https://ds2-lab.github.io/Wukong/",
    image: wukong_logo,
    keywords: ["serverless", "dag", "linear algebra", "task scheduling", "distributed", "python", "data analytics"],
    builtWith: ["AWS", "AWS Lambda", "Python", "Dask"],
    arxiv_links: ["https://arxiv.org/abs/1910.05896", "https://arxiv.org/abs/2010.07268"],
    status: 'inactive',
}

export const InfiniStoreProject: Project = {
    name: "InfiniStore",
    description: "InfiniStore is an elastic, cost-effective, and high-performance object storage built atop ephemeral cloud funtions. InfiniStore offers automatic elasticity, durability, strong consistency, and high performance.",
    venue: "VLDB'23",
    repo_url: "https://github.com/ds2-lab/infinistore",
    image: infinistore_logo,
    project_website_url: "",
    keywords: ["serverless", "object storage", "caching", "persistence", "fault tolerance", "erasure coding"],
    builtWith: ["AWS", "AWS Lambda", "AWS S3", "Golang"],
    arxiv_links: ["https://arxiv.org/abs/2209.01496"],
    status: 'inactive',
}

export const LambdaFSProject: Project = {
    name: "λFS",
    description: "λFS is an elastic, scalable, and high-performance metadata service for large-scale distributed file systems (DFSes) that uses a FaaS-based metadata cache to maximize performance & cost efficiency.",
    venue: "ASPLOS'23",
    repo_url: "https://github.com/ds2-lab/LambdaFS",
    project_website_url: "",
    image: lfs_logo,
    keywords: ["serverless", "distributed file systems", "file storage", "metadata", "elasticity", "fault tolerance"],
    builtWith: ["AWS", "Google Cloud", "IBM Cloud", "Nuclio", "OpenWhisk", "Java", "C++", "Python", "Golang", "MySQL Cluster NDB", "HopsFS", "HDFS", "Hadoop"],
    arxiv_links: ["https://arxiv.org/abs/2306.11877"],
    status: 'inactive',
}

export const JupyterNotebookProject: Project = {
    name: "Jupyter NaaS",
    description: "I'm working on a Jupyter Notebooks-as-a-Service (NaaS) platform that is optimized for providing maximum interactivity for users.",
    venue: "",
    repo_url: "",
    project_website_url: "",
    image: jupyter_naas,
    keywords: ["serverless", "deep learning", "jupyter notebooks", "gpu scheduling", "platforms"],
    arxiv_links: [],
    status: 'ongoing',
}

export const ObliviousInfiniStoreProject: Project = {
    name: "Oblivious InfiniStore",
    description: "An extension of InfiniStore with a focus on data security (obliviousness) that offers good performance as well as security guarantees.",
    venue: "",
    repo_url: "",
    arxiv_links: [],
    image: obliv_inf_store_logo,
    project_website_url: "",
    keywords: ["serverless", "storage", "obliviousness", "persistence", "security", "privacy"],
    status: 'ongoing',
}

export const FaasPlatformProject: Project = {
    name: "FaaS Platforms",
    description: "I'm using my prior experiences developing stateful applications for serverless computing to design and create a highly-optimized and scalable Functions-as-a-Service (FaaS) platform.",
    venue: "",
    repo_url: "",
    arxiv_links: [],
    image: faas_platform_logo,
    project_website_url: "",
    keywords: ["serverless", "cloud provider", "functions as a service", "platform", "scalability"],
    status: 'ongoing',
}

export const PastProjects: Project[] = [
    WukongProject, InfiniStoreProject, LambdaFSProject,
]

export const CurrentProjects: Project[] = [
    JupyterNotebookProject, ObliviousInfiniStoreProject, FaasPlatformProject
]