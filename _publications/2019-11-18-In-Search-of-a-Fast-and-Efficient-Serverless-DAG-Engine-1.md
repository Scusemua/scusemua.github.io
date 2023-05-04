---
title: "In Search of a Fast and Efficient Serverless DAG Engine"
collection: publications
permalink: /publication/2009-10-01-paper-title-number
excerpt: 'We identify and evaluate a set of techniques to make DAG schedulers serverless-aware. These techniques have been implemented in Wukong, a serverless, DAG scheduler attuned to AWS Lambda. Wukong provides decentralized scheduling through a combination of static and dynamic scheduling. We present the results of an empirical study in which Wukong is applied to a range of microbenchmark and real-world DAG applications. Results demonstrate the efficacy of Wukong in minimizing the performance overhead introduced by AWS Lambda --- Wukong achieves competitive performance compared to a serverful DAG scheduler, while improving the performance of real-world DAG jobs by as much as 3.1X at larger scale.'
date: 2019-11-18
venue: 'PDSW 2019'
paperurl: 'https://arxiv.org/pdf/1910.05896.pdf'
citation: 'Benjamin Carver, Jingyuan Zhang, Ao Wang, Yue Cheng, (2019). &quot;In Search of a Fast and Efficient Serverless DAG Engine.&quot; <i>PDSW19</i>.'
---

![Wukong Logo](/assets/images/wukong_logo.png)

<a href="{{ site.baseurl }}/pdfs/wukong_pdsw.pdf" target="_blank">Download paper here.</a>

### To cite Wukong (PDSW)
```
@INPROCEEDINGS {pdsw19-wukong,
author = {B. Carver and J. Zhang and A. Wang and Y. Cheng},
  booktitle = {2019 IEEE/ACM Fourth International Parallel Data Systems Workshop (PDSW)},
  title = {In Search of a Fast and Efficient Serverless DAG Engine},
  year = {2019},
  doi = {10.1109/PDSW49588.2019.00005},
  url = {https://doi.ieeecomputersociety.org/10.1109/PDSW49588.2019.00005},
  publisher = {IEEE Computer Society}
}
```