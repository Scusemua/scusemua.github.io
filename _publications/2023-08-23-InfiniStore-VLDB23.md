---
title: "InfiniStore: Elastic Serverless Cloud Storage"
collection: publications
permalink: /publication/2023-InfiniStore-VLDB23
excerpt: 'We design and implement InfiniStore (Serverless I/O Nirvana), a persistent and elastic cloud storage system, which seamlessly couples the function-based ServerlessMemory layer with a persistent, inexpensive cloud object store layer. InfiniStore enables durability despite function failures using a fast parallel recovery scheme built on the auto-scaling functionality of a FaaS (Function-as-a-Service) platform. We evaluate InfiniStore extensively using three real-world applications and results show that InfiniStore achieves 27.77% and 97.30% tenant-side cost reduction compared to InfiniCache (a serverless-function-based object cache) and AWS ElastiCache respectively, while offering pay-per-access with competitive performance.'
date: 2023-08-23
venue: 'VLDB 2023'
paperurl: 'https://arxiv.org/abs/2209.01496'
citation: 'Jingyuan Zhang, Ao Wang, Xiaolong Ma, Benjamin Carver, Nicholas John Newman, Ali Anwar, Lukas Rupprecht, Dimitrios Skourtis, Vasily Tarasov, Feng Yan, Yue Cheng. (2023). &quot;InfiniStore: Elastic Serverless Cloud Storage.&quot; <i>VLDB23</i>.'
---

![InfiniStore Logo](/assets/images/infinistore_logo.png)

Cloud object storage such as AWS S3 is cost-effective and highly elastic but relatively slow, while high-performance cloud storage such as AWS ElastiCache is expensive and provides limited elasticity. We present a new cloud storage service called ServerlessMemory, which stores data using the memory of serverless functions. ServerlessMemory employs a time-window-based data placement strategy to effectively segregate old and new data and provides high elasticity, performance, and a pay-per-access cost model with extremely low cost for a new memory-based storage. 

We then design and implement InfiniStore (Serverless I/O Nirvana), a persistent and elastic cloud storage system, which seamlessly couples the function-based ServerlessMemory layer with a persistent, inexpensive cloud object store layer. InfiniStore enables durability despite function failures using a fast parallel recovery scheme built on the auto-scaling functionality of a FaaS (Function-as-a-Service) platform. We evaluate InfiniStore extensively using three real-world applications and results show that InfiniStore achieves 27.77% and 97.30% tenant-side cost reduction compared to InfiniCache (a serverless-function-based object cache) and AWS ElastiCache respectively, while offering pay-per-access with competitive performance.

[Download paper here](https://arxiv.org/abs/2209.01496)

### To cite InfiniStore
```
@inproceedings {vldb23-infinistore,
  author       = {Jingyuan Zhang and Ao Wang and Xiaolong Ma and Benjamin Carver and Nicholas John Newman and Ali Anwar and Lukas Rupprecht and Dimitrios Skourtis and Vasily Tarasov and Feng Yan and Yue Cheng},
  title        = {InfiniStore: Elastic Serverless Cloud Storage},
  journal      = {Proc. {VLDB} Endow.},
  volume       = {16},
  number       = {7},
  pages        = {1629--1642},
  year         = {2023},
  url          = {https://www.vldb.org/pvldb/vol16/p1629-zhang.pdf},
}
```

### To cite InfiniCache
```
@inproceedings {246184,
author = {Ao Wang and Jingyuan Zhang and Xiaolong Ma and Ali Anwar and Lukas Rupprecht and Dimitrios Skourtis and Vasily Tarasov and Feng Yan and Yue Cheng},
title = {InfiniCache: Exploiting Ephemeral Serverless Functions to Build a Cost-Effective Memory Cache},
booktitle = {18th USENIX Conference on File and Storage Technologies ({FAST} 20)},
year = {2020},
isbn = {978-1-939133-12-0},
address = {Santa Clara, CA},
pages = {267--281},
url = {https://www.usenix.org/conference/fast20/presentation/wang-ao},
publisher = {USENIX Association},
month = feb,
}
```