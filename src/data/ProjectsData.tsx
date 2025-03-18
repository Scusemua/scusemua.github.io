import wukong_logo from "@images/logos/wukong_logo.webp";
import infinistore_logo from "@images/logos/infinistore_logo.webp";
import obliv_inf_store_logo from "@images/logos/oblivious_infinistore_logo.webp";
import lfs_logo from "@images/logos/lambda_fs_logo.webp";
import jupyter_naas from "@images/logos/jupyter_naas_logo.webp";
import optimal_gpu_platform_logo from "@images/logos/optimal_gpu_platform_logo.png";
import distributed_dl_training from "@images/logos/distributed_dl_training_logo.png";
import faas_platform_logo from "@images/logos/faas_platforms_logo.webp";
import LambdaFSArchitecture from "@data/architecture_diagrams/lambda_fs_arch";
import WukongArchitecture from "@data/architecture_diagrams/wukong_arch";
import React from "react";
import InfiniStoreArchitecture from "@data/architecture_diagrams/infinistore_arch";

export interface Project {
    name: string;
    description: string;
    extendedDescription?: string;
    venue: string | string[];
    repo_url: string;
    project_website_url: string;
    presentation_url?: string;
    presentation_venue?: string;
    image: string;
    keywords: string[];
    arxiv_links: string[];
    builtWith?: string[];
    learnMoreEnabled?: boolean;
    architectureDiagramPath?: string;
    architectureDiagram?: React.JSX.Element;
    architectureDiagramHeight?: number;
    architectureDiagramIsInteractive?: boolean;
    learnMoreUrl?: string;
    status: 'ongoing' | 'inactive';
}

export const WukongProject: Project = {
    name: "Wukong",
    description: "Wukong is a scalable, high-performance, and locality-aware serverless DAG engine. Wukong uses FaaS to accelerate the execution of linear algebra, ML, and data analytics workloads.",
    extendedDescription: "The results of Wukong's evaluation showed that it executes large-scale parallel computing jobs up to 68.17× faster while reducing tenant-side cost by 92.96% compared to state-of-the-art industry and academic baselines.",
    venue: ["PDSW'19", "SoCC'20"],
    repo_url: "https://github.com/ds2-lab/Wukong/tree/socc2020",
    project_website_url: "https://ds2-lab.github.io/Wukong/",
    image: wukong_logo,
    keywords: ["serverless", "dag", "linear algebra", "task scheduling", "distributed", "python", "data analytics"],
    builtWith: ["AWS", "AWS Lambda", "Python", "Dask"],
    arxiv_links: ["https://arxiv.org/abs/1910.05896", "https://arxiv.org/abs/2010.07268"],
    presentation_url: "https://youtu.be/W0tENnx_58I",
    presentation_venue: "SoCC'20",
    learnMoreEnabled: false,
    learnMoreUrl: "projects/wukong",
    architectureDiagram: <WukongArchitecture/>,
    architectureDiagramHeight: 512,
    status: 'inactive',
}

export const InfiniStoreProject: Project = {
    name: "InfiniStore",
    description: "InfiniStore is an elastic, cost-effective, and high-performance object store built atop ephemeral cloud functions. InfiniStore offers automatic elasticity, durability, strong consistency, and high performance.",
    extendedDescription: "Our extensive evaluation of InfiniStore showed that the system provides competitive performance with state-of-the-art data storage services AWS ElastiCache and Anna while reducing user-side cost by 97.24% (compared to AWS ElastiCache).",
    venue: "VLDB'23",
    repo_url: "https://github.com/ds2-lab/infinistore",
    image: infinistore_logo,
    project_website_url: "",
    keywords: ["serverless", "object storage", "caching", "persistence", "fault tolerance", "erasure coding"],
    builtWith: ["AWS", "AWS Lambda", "AWS S3", "Golang"],
    architectureDiagram: <InfiniStoreArchitecture/>,
    architectureDiagramHeight: 512,
    arxiv_links: ["https://arxiv.org/abs/2209.01496"],
    status: 'inactive',
}

export const LambdaFSProject: Project = {
    name: "λFS",
    description: "λFS is a first-of-its-kind elastic, scalable, and high-performance metadata service for large-scale distributed file systems (DFSes) that uses a FaaS-based metadata cache to maximize performance & cost efficiency.",
    extendedDescription: "λFS leverages the benefits of serverless computing to provide up to 4.13x higher throughput, 90.40% lower latency, and 85.99% lower user cost compared to state-of-the-art baselines for a real-world industrial workload.",
    venue: "ASPLOS'23",
    repo_url: "https://github.com/ds2-lab/LambdaFS",
    project_website_url: "",
    image: lfs_logo,
    keywords: ["serverless", "distributed file systems", "file storage", "metadata"],
    builtWith: ["AWS", "Google Cloud", "IBM Cloud", "Nuclio", "OpenWhisk", "Java", "C++", "MySQL Cluster NDB", "HopsFS", "HDFS"],
    arxiv_links: ["https://arxiv.org/abs/2306.11877"],
    architectureDiagramIsInteractive: true,
    status: 'inactive',
    architectureDiagram: <LambdaFSArchitecture/>,
    architectureDiagramHeight: 280,
}

export const JupyterNotebookProject: Project = {
    // name: "Jupyter NaaS",
    name: "Distributed Deep Learning Training",
    description: "I'm developing a platform optimized for multi-tenant distributed deep learning training workloads. By leveraging a novel design, the platform enhances resource utilization and reduces JCT while integrating industry-standard tools like Prometheus, Loki, and Grafana for real-time monitoring, metric collection, and visualization.",
    // description: "I'm working on a Jupyter Notebooks-as-a-Service (NaaS) platform that is optimized for providing maximum interactivity for users. The platform uses a novel designed that we developed to enable support for new classes of AI/ML applications and workloads.",
    extendedDescription: "",
    venue: "",
    // repo_url: "https://github.com/Scusemua/Jupyter-NaaS-Dashboard",
    repo_url: "",
    project_website_url: "",
    image: distributed_dl_training, // jupyter_naas,
    keywords: ["serverless", "deep learning", "gpu scheduling", "platforms"], // "jupyter notebooks"
    builtWith: ["Kubernetes", "Docker", "Golang", "Python"],
    arxiv_links: [],
    status: 'ongoing',
}

export const GpuPricingProject: Project = {
    // name: "Jupyter NaaS",
    name: "Optimal GPU Training Platform",
    description: "Building on our multi-tenant deep learning platform, we are developing an optimized cost-aware scheduling and pricing model for shared GPU environments.",
    // description: "I'm working on a Jupyter Notebooks-as-a-Service (NaaS) platform that is optimized for providing maximum interactivity for users. The platform uses a novel designed that we developed to enable support for new classes of AI/ML applications and workloads.",
    extendedDescription: "This extension focuses on dynamic resource allocation, fair cost distribution, and maximizing GPU efficiency to ensure an optimal balance between performance and user cost.",
    venue: "",
    // repo_url: "https://github.com/Scusemua/Jupyter-NaaS-Dashboard",
    repo_url: "",
    project_website_url: "",
    image: optimal_gpu_platform_logo, // jupyter_naas,
    keywords: ["serverless", "deep learning", "gpu scheduling", "platforms"], // "jupyter notebooks"
    builtWith: ["Kubernetes", "Docker", "Golang", "Python"],
    arxiv_links: [],
    status: 'ongoing',
}

export const ObliviousInfiniStoreProject: Project = {
    name: "Oblivious InfiniStore",
    description: "This project is focused on the design and creation of an extension of InfiniStore that provides enhanced security while still delivering strong performance and scalability.",
    extendedDescription: "Specifically, we are designing an enhanced version of InfiniStore using techniques from cryptography, computer and network security, and oblivious storage and database systems. This new version will offer strong privacy and security guarantees while leveraging the unique benefits of FaaS to offset the overheads introduced by these new guarantees.",
    venue: "",
    repo_url: "",
    arxiv_links: [],
    image: obliv_inf_store_logo,
    project_website_url: "",
    keywords: ["serverless", "storage", "obliviousness", "persistence", "security", "privacy"],
    builtWith: ["Golang", "C", "C++"],
    status: 'ongoing',
}

export const FaasPlatformProject: Project = {
    name: "FaaS Platforms",
    description: "I'm using my prior experiences developing stateful applications for serverless computing to design and create a highly-optimized and scalable Functions-as-a-Service (FaaS) platform.",
    extendedDescription: "Specifically, we're incorporating techniques and strategies from cryptography, network security, and database systems to provide strong security guarantees while leveraging FaaS to provide good performance",
    venue: "",
    repo_url: "",
    arxiv_links: [],
    image: faas_platform_logo,
    project_website_url: "",
    keywords: ["serverless", "cloud provider", "functions as a service", "platform", "scalability"],
    builtWith: ["Python", "CPython", "C++"],
    status: 'ongoing',
}

export const PastProjects: Project[] = [
    WukongProject, InfiniStoreProject, LambdaFSProject,
]

export const CurrentProjects: Project[] = [
    JupyterNotebookProject, GpuPricingProject, ObliviousInfiniStoreProject, FaasPlatformProject,
]