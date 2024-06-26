---
title: "Wukong: A Scalable and Locality-Enhanced Framework for Serverless Parallel Computing"
collection: publications
permalink: /publication/2020-Wukong-SoCC
excerpt: 'In this paper, we thoroughly investigate the problem space of DAG scheduling in serverless computing. We identify and evaluate a set of techniques to make DAG schedulers serverless-aware. These techniques have been implemented in Wukong, a serverless, DAG scheduler attuned to AWS Lambda. Wukong provides decentralized scheduling through a combination of static and dynamic scheduling. We present the results of an empirical study in which Wukong is applied to a range of microbenchmark and real-world DAG applications. Results demonstrate the efficacy of Wukong in minimizing the performance overhead introduced by AWS Lambda --- Wukong achieves competitive performance compared to a serverful DAG scheduler, while improving the performance of real-world DAG jobs by as much as 3.1X at larger scale.'
date: 2020-10-19
venue: 'SOCC 2020'
paperurl: 'https://arxiv.org/abs/2010.07268'
---

![Wukong Logo](/assets/images/wukong_logo.png)

[View the GitHub repo here.](https://github.com/ds2-lab/Wukong/tree/socc2020)

### To cite Wukong (SoCC)
```
@inproceedings{socc20-wukong,
author = {Carver, Benjamin and Zhang, Jingyuan and Wang, Ao and Anwar, Ali and Wu, Panruo and Cheng, Yue},
  title = {Wukong: A Scalable and Locality-Enhanced Framework for Serverless Parallel Computing},
  year = {2020},
  isbn = {9781450381376},
  publisher = {Association for Computing Machinery},
  url = {https://doi.org/10.1145/3419111.3421286},
  doi = {10.1145/3419111.3421286},
  series = {SoCC '20}
}
```