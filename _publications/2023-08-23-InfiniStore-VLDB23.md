---
title: "Sion: Elastic Serverless Cloud Storage"
collection: publications
permalink: /publication/2023-SION-VLDB23
excerpt: 'We design and implement InfiniStore (Serverless I/O Nirvana), a persistent and elastic cloud storage system, which seamlessly couples the function-based ServerlessMemory layer with a persistent, inexpensive cloud object store layer. InfiniStore enables durability despite function failures using a fast parallel recovery scheme built on the auto-scaling functionality of a FaaS (Function-as-a-Service) platform. We evaluate InfiniStore extensively using three real-world applications and results show that InfiniStore achieves 27.77% and 97.30% tenant-side cost reduction compared to InfiniCache (a serverless-function-based object cache) and AWS ElastiCache respectively, while offering pay-per-access with competitive performance.'
date: 2023-08-23
venue: 'VLDB 23'
paperurl: 'https://arxiv.org/abs/2209.01496'
citation: 'Jingyuan Zhang, Ao Wang, Xiaolong Ma, Benjamin Carver, Nicholas John Newman, Ali Anwar, Lukas Rupprecht, Dimitrios Skourtis, Vasily Tarasov, Feng Yan, Yue Cheng. (2023). &quot;InfiniStore: Elastic Serverless Cloud Storage.&quot; <i>VLDB23</i>.'
---

Cloud object storage such as AWS S3 is cost-effective and highly elastic but relatively slow, while high-performance cloud storage such as AWS ElastiCache is expensive and provides limited elasticity. We present a new cloud storage service called ServerlessMemory, which stores data using the memory of serverless functions. ServerlessMemory employs a time-window-based data placement strategy to effectively segregate old and new data and provides high elasticity, performance, and a pay-per-access cost model with extremely low cost for a new memory-based storage. 

We then design and implement InfiniStore (Serverless I/O Nirvana), a persistent and elastic cloud storage system, which seamlessly couples the function-based ServerlessMemory layer with a persistent, inexpensive cloud object store layer. InfiniStore enables durability despite function failures using a fast parallel recovery scheme built on the auto-scaling functionality of a FaaS (Function-as-a-Service) platform. We evaluate InfiniStore extensively using three real-world applications and results show that InfiniStore achieves 27.77% and 97.30% tenant-side cost reduction compared to InfiniCache (a serverless-function-based object cache) and AWS ElastiCache respectively, while offering pay-per-access with competitive performance.

[Download paper here](https://arxiv.org/abs/2209.01496)

Recommended citation: 'Jingyuan Zhang, Ao Wang, Xiaolong Ma, Benjamin Carver, Nicholas John Newman, Ali Anwar, Lukas Rupprecht, Dimitrios Skourtis, Vasily Tarasov, Feng Yan, Yue Cheng. (2023). &quot;InfiniStore: Elastic Serverless Cloud Storage.&quot; <i>VLDB23</i>'