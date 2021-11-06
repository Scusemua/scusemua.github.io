---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am a first-year PhD student in computer science at [George Mason Univeristy](https://cs.gmu.edu/). I work with [Dr. Yue Cheng](https://cs.gmu.edu/~yuecheng/) in [LeapLab](https://mason-leap-lab.github.io/).

# Research Interests
My research interests are centered around cloud computing, generally with a focus in ___serverless computing___. Specifically, I am interested in applications of serverless computing to data analytics, machine learning, and file systems.

## Current & Previous Projects

### Wukong (Ongoing)

{% include ./wukong.html image_path="./DAG.png" title="Wukong" description="Wukong DAG based workloads" %}

[Wukong](https://mason-leap-lab.github.io/Wukong/) is a serverless-oriented, locality-aware directed acyclic graph (DAG) execution engine. I developed Wukong during my senior year as an undergraduate. Wukong uses serverless computing to scale to thousands of executors in seconds. The framework leverages serverless computings' pay-per-use pricing model to keep costs low while providing support for a wide variety from workloads, ranging from machine learning and linear algebra to data analytics. Wukong can be easily deployed on a home computer or in the cloud and is open source. The framework is able to execute parallel workloads up to 68.17x faster, reduce network I/O by several orders of magnitude, and achieves 92.96% tenant-side cost savings compared to other state-of-the-art frameworks. 

### Serverless Metadata (Ongoing)
I am presently leading a project exploring the use of serverless functions to implement the metadata management component of distributed file systems. Using serverless functions for this purpose enables strong scalability and performance while keeping costs low and resource utilization high. Adapting serverless platforms for use in large-scale distributed file systems presents a number of interesting challenges and opportunities!

### InfiniCache (Ongoing)
I am working with several of my fellow LeapLab collegues on a project of theirs titled [_InfiniCache_](https://mason-leap-lab.github.io/infinicache/). InfiniCache is a first-of-its-kind in-memory object caching system built completely atop serverless functions. The system works by storing users' data in the local memory (RAM) of serverless functions, leveraging the high scalability and elasticity of the platform to provide good performance while taking advantage of serverless functions' pay-for-what-you-use pricing model to keep costs low. 