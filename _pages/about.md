---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am a second-year PhD student in computer science at [George Mason Univeristy](https://cs.gmu.edu/). My advisors are [Dr. Yue Cheng](https://tddg.github.io/) from Univeristy of Virginia and [Dr. Songqing Chen](https://cs.gmu.edu/~sqchen/) from George Mason Univeristy. Much of my work is performed within the [Ds<sup>2</sup> Lab](https://ds2-lab.github.io/) at UVA.

# Research Interests
My research interests are centered around cloud computing, generally with a focus in ___serverless computing___. Specifically, I am interested in applications of serverless computing to data analytics, machine learning, and file systems.

## Current Projects

### [Wukong](https://scusemua.github.io/publication/2020-Wukong-SoCC) 

![Wukong Logo](assets/images/wukong_logo.png)

[Wukong](https://ds2-lab.github.io/Wukong/) is a serverless-oriented, locality-aware directed acyclic graph (DAG) execution engine. I developed Wukong during my senior year as an undergraduate. Wukong uses serverless computing to scale to thousands of executors in seconds. The framework leverages serverless computings' pay-per-use pricing model to keep costs low while providing support for a wide variety from workloads, ranging from machine learning and linear algebra to data analytics. Wukong can be easily deployed on a home computer or in the cloud and is open source. The framework is able to execute parallel workloads up to 68.17x faster, reduce network I/O by several orders of magnitude, and achieves 92.96% tenant-side cost savings compared to other state-of-the-art frameworks. Present work is focused on expanding the framework's programming model and exploring unique optimization strategies.

### [Serverless Metadata: λFS](https://scusemua.github.io/publication/2024-LFS-ASPLOS)

![λFS: Logo](assets/images/lfs_logo.png)

λFS is an elastic, high-performance metadata service for large-scale distributed file systems. λMDS scales a DFS metadata cache on a FaaS (Function-as-a-Service) platform and synthesizes a series of techniques to overcome the obstacles that are encountered when building large stateful applications on FaaS platforms. 

I am presently leading a project exploring the use of serverless functions to implement the metadata management component of distributed file systems. Using serverless functions for this purpose enables strong scalability and performance while keeping costs low and resource utilization high. Adapting serverless platforms for use in large-scale distributed file systems presents a number of interesting challenges and opportunities!

### [InfiniStore](https://scusemua.github.io/publication/2023-InfiniStore-VLDB23)

![InfiniStore Logo](assets/images/infinistore_logo.png)

I am working with several of my fellow LeapLab collegues on a project of theirs titled [_InfiniStore_](https://github.com/ds2-lab/infinistore). InfiniStore is an elastic, cost-effective, and high-performance object storage built atop ephemeral cloud functions. Built on top of the [InfiniCache](https://ds2-lab.github.io/infinicache/) codebase, InfiniStore offers automatic elasticity, durability, strong consistency, and high performance.
