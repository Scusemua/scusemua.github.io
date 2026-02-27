'use client';

import React from "react";
import {motion, useScroll, useTransform} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {Fab, Stack} from "@mui/material";
import {ArrowBack, GitHub, OndemandVideo, Description} from "@mui/icons-material";
import lfsLogo from "@images/logos/lambda_fs_logo.webp";

const GRADIENT = "linear-gradient(135deg, #f97316 0%, #ec4899 100%)";
const ACCENT = "#f97316";

const sectionStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "4rem 2rem",
    position: "relative",
    overflow: "hidden",
};

const fadeUp = {
    hidden: {opacity: 0, y: 60},
    visible: {opacity: 1, y: 0},
};

const fadeIn = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
};

const scaleUp = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {opacity: 1, scale: 1},
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

function HeroSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

    return (
        <div ref={ref} style={{...sectionStyle, background: "#0d0808", minHeight: "100vh"}}>
            <motion.div style={{opacity, scale, y, textAlign: "center"}}>
                <motion.div
                    initial={{opacity: 0, scale: 0.7}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    style={{marginBottom: "2rem"}}
                >
                    <Image
                        src={lfsLogo}
                        alt="λFS Logo"
                        width={460}
                        height={200}
                        style={{objectFit: "contain", maxWidth: "85vw", height: "auto"}}
                        priority
                    />
                </motion.div>

                <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5, duration: 0.6}}
                    style={{
                        color: "#b09080",
                        fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                        maxWidth: "640px",
                        lineHeight: 1.7,
                        margin: "0 auto",
                    }}
                >
                    An elastic, high-performance metadata service for large-scale distributed file systems
                </motion.p>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1.2, duration: 0.8}}
                    style={{marginTop: "4rem"}}
                >
                    <motion.div
                        animate={{y: [0, 10, 0]}}
                        transition={{repeat: Infinity, duration: 1.8, ease: "easeInOut"}}
                        style={{color: ACCENT, fontSize: "2rem"}}
                    >
                        ↓
                    </motion.div>
                    <p style={{color: "#554", fontSize: "0.85rem", marginTop: "0.5rem"}}>Scroll to explore</p>
                </motion.div>
            </motion.div>
        </div>
    );
}

function ProblemSection() {
    return (
        <div style={{...sectionStyle, background: "#0e0a09"}}>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.4}}
                style={{maxWidth: "900px", textAlign: "center"}}
            >
                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                    }}
                >
                    The Problem
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        margin: "0 0 2rem",
                    }}
                >
                    Metadata is the{" "}
                    <span style={{
                        background: GRADIENT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        bottleneck
                    </span>
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#908880",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        lineHeight: 1.8,
                        maxWidth: "750px",
                        margin: "0 auto",
                    }}
                >
                    The metadata service (MDS) sits on the{" "}
                    <em style={{color: "#c0b0a0"}}>critical path</em> for every distributed
                    file system operation. Common &ldquo;serverful&rdquo; MDS architectures — a
                    single server or a cluster of servers — are either not scalable or make it
                    difficult to achieve an optimal balance of performance, resource utilization,
                    and cost.
                </motion.p>
            </motion.div>
        </div>
    );
}

function TradeoffSection() {
    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #0e0a09 0%, #100c0a 100%)",
        }}>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                style={{maxWidth: "1100px", width: "100%"}}
            >
                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    The Serverful Trade-off
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        textAlign: "center",
                        margin: "0 auto 3rem",
                        maxWidth: "850px",
                    }}
                >
                    Scalability, performance, or cost — pick two
                </motion.h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem",
                    width: "100%",
                    maxWidth: "900px",
                    margin: "0 auto",
                }}>
                    {[
                        {
                            title: "Single-Server MDS",
                            description: "Simple and low-cost, but becomes a scalability bottleneck as the file system grows to billions of files and thousands of clients.",
                        },
                        {
                            title: "Clustered MDS",
                            description: "More scalable, but achieving optimal performance with good resource utilization at reasonable cost requires careful and complex tuning.",
                        },
                        {
                            title: "The Missing Architecture",
                            description: "A modern MDS needs elastic scaling, massive parallelism, and cost efficiency — without sacrificing performance or forcing operational complexity.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            variants={fadeUp}
                            transition={{duration: 0.6, delay: i * 0.15}}
                            style={{
                                background: `rgba(249, 115, 22, 0.06)`,
                                border: `1px solid rgba(249, 115, 22, 0.15)`,
                                borderRadius: "16px",
                                padding: "2rem",
                            }}
                        >
                            <h3 style={{
                                color: "#e0d0c0",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                                marginTop: 0,
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: "#887870",
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                margin: 0,
                            }}>
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function SolutionSection() {
    return (
        <div style={{...sectionStyle, background: "#100c0a"}}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.4}}
                style={{textAlign: "center", maxWidth: "900px"}}
            >
                <motion.p
                    variants={fadeIn}
                    transition={{duration: 0.5}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "2rem",
                    }}
                >
                    The Insight
                </motion.p>

                <motion.h2
                    variants={scaleUp}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    style={{
                        fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        margin: "0 0 2rem",
                        background: GRADIENT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Serverless
                    <br/>
                    Metadata
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7, delay: 0.3}}
                    style={{
                        color: "#908880",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        lineHeight: 1.8,
                        maxWidth: "700px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    λFS scales a DFS metadata cache elastically on a FaaS platform,
                    synthesizing a series of techniques to overcome the obstacles encountered
                    when building{" "}
                    <em style={{color: "#c0b0a0"}}>large, stateful, and performance-sensitive
                    applications</em> on serverless infrastructure.
                </motion.p>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.5}}
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {["Elastic Scaling", "Massive Parallelism", "FaaS-Powered Cache", "Cost Efficient"].map((label) => (
                        <motion.span
                            key={label}
                            variants={fadeUp}
                            transition={{duration: 0.4}}
                            style={{
                                background: `rgba(249, 115, 22, 0.12)`,
                                border: `1px solid rgba(249, 115, 22, 0.25)`,
                                borderRadius: "999px",
                                padding: "0.6rem 1.4rem",
                                color: "#c0a088",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                            }}
                        >
                            {label}
                        </motion.span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

function ArchitectureSection() {
    const pillars = [
        {
            icon: "☁️",
            title: "FaaS Metadata Cache",
            description: "λFS deploys metadata caching logic as serverless functions, scaling cache capacity elastically with demand instead of over-provisioning servers.",
        },
        {
            icon: "⚡",
            title: "Elastic Scaling",
            description: "Takes full advantage of FaaS elastic scaling — the metadata layer grows and shrinks automatically to match workload intensity.",
        },
        {
            icon: "🔀",
            title: "Massive Parallelism",
            description: "FaaS enables massive parallelism for metadata operations, processing thousands of concurrent requests without coordination bottlenecks.",
        },
        {
            icon: "🛠️",
            title: "Stateful on Serverless",
            description: "Synthesizes novel techniques to overcome the challenges of building large, stateful, performance-sensitive applications on inherently stateless FaaS platforms.",
        },
    ];

    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #100c0a 0%, #0e0a09 100%)",
        }}>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.2}}
                style={{maxWidth: "1100px", width: "100%"}}
            >
                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    How It Works
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        textAlign: "center",
                        marginBottom: "3rem",
                        marginTop: 0,
                    }}
                >
                    Serverless functions as metadata infrastructure
                </motion.h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1000px",
                    margin: "0 auto",
                }}>
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            variants={fadeUp}
                            transition={{duration: 0.5, delay: i * 0.12}}
                            whileHover={{
                                y: -8,
                                transition: {duration: 0.2},
                            }}
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "20px",
                                padding: "2rem",
                                cursor: "default",
                            }}
                        >
                            <div style={{fontSize: "2.5rem", marginBottom: "1rem"}}>{pillar.icon}</div>
                            <h3 style={{
                                color: "#e0d0c0",
                                fontSize: "1.15rem",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                                marginTop: 0,
                            }}>
                                {pillar.title}
                            </h3>
                            <p style={{
                                color: "#807068",
                                fontSize: "0.95rem",
                                lineHeight: 1.7,
                                margin: 0,
                            }}>
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({value, label, delay}: { value: string; label: string; delay: number }) {
    return (
        <motion.div
            variants={scaleUp}
            transition={{duration: 0.6, delay}}
            style={{textAlign: "center", padding: "2rem 1rem"}}
        >
            <div style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
                marginBottom: "0.75rem",
            }}>
                {value}
            </div>
            <p style={{
                color: "#807068",
                fontSize: "1rem",
                margin: 0,
                lineHeight: 1.5,
            }}>
                {label}
            </p>
        </motion.div>
    );
}

function ResultsSection() {
    return (
        <div style={{...sectionStyle, background: "#0e0a09"}}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                style={{maxWidth: "1100px", width: "100%", textAlign: "center"}}
            >
                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                    }}
                >
                    Results
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        marginTop: 0,
                    }}
                >
                    Outperforming the state of the art
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7, delay: 0.1}}
                    style={{
                        color: "#807068",
                        fontSize: "1.1rem",
                        maxWidth: "650px",
                        margin: "0 auto 3rem",
                    }}
                >
                    Evaluated against state-of-the-art distributed file systems using an
                    industrial workload, λFS delivers transformative improvements.
                </motion.p>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.4}}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "0.5rem",
                        maxWidth: "950px",
                        margin: "0 auto",
                    }}
                >
                    <StatCard value="4.13×" label="Higher throughput" delay={0}/>
                    <StatCard value="90.40%" label="Lower latency" delay={0.1}/>
                    <StatCard value="85.99%" label="Lower cost" delay={0.2}/>
                    <StatCard value="3.33×" label="Better perf-per-cost" delay={0.3}/>
                </motion.div>
            </motion.div>
        </div>
    );
}

function ImplementationSection() {
    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #0e0a09 0%, #100c0a 100%)",
            minHeight: "70vh",
        }}>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.4}}
                style={{maxWidth: "800px", textAlign: "center"}}
            >
                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        color: ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                    }}
                >
                    Implementation
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "2rem",
                        marginTop: 0,
                    }}
                >
                    Multi-cloud, battle-tested
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#908880",
                        fontSize: "clamp(1rem, 2vw, 1.15rem)",
                        lineHeight: 1.8,
                        marginBottom: "2.5rem",
                    }}
                >
                    λFS is built on top of HopsFS/HDFS and has been deployed and evaluated across
                    AWS, Google Cloud, and IBM Cloud using serverless platforms including Nuclio
                    and OpenWhisk. The metadata cache layer is implemented in Java and C++ for
                    maximum throughput, backed by MySQL Cluster NDB for persistent storage.
                </motion.p>

                <motion.div
                    variants={fadeUp}
                    transition={{duration: 0.6}}
                    style={{
                        display: "flex",
                        gap: "0.75rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {["AWS", "Google Cloud", "IBM Cloud", "Nuclio", "OpenWhisk", "Java", "C++", "MySQL Cluster NDB", "HopsFS"].map((tech) => (
                        <span
                            key={tech}
                            style={{
                                background: `rgba(249, 115, 22, 0.08)`,
                                border: `1px solid rgba(249, 115, 22, 0.2)`,
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                                color: "#a09080",
                                fontSize: "0.9rem",
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

function CTASection() {
    const linkStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.9rem 1.8rem",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: 600,
        textDecoration: "none",
    };

    return (
        <div style={{
            ...sectionStyle,
            background: "#100c0a",
            minHeight: "60vh",
        }}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.5}}
                style={{textAlign: "center"}}
            >
                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#f0e8e0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        marginTop: 0,
                    }}
                >
                    Explore λFS
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6, delay: 0.1}}
                    style={{
                        color: "#807068",
                        fontSize: "1.1rem",
                        maxWidth: "500px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    Read the paper, explore the code, or watch the presentation.
                </motion.p>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                >
                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <motion.a
                            variants={fadeUp}
                            transition={{duration: 0.5}}
                            href="https://arxiv.org/abs/2306.11877"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...linkStyle,
                                background: GRADIENT,
                                color: "#fff",
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.98}}
                        >
                            <Description fontSize="small"/>
                            Read the Paper
                        </motion.a>
                        <motion.a
                            variants={fadeUp}
                            transition={{duration: 0.5}}
                            href="https://github.com/ds2-lab/LambdaFS"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...linkStyle,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "#d0c0b0",
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.98}}
                        >
                            <GitHub fontSize="small"/>
                            View Source
                        </motion.a>
                        <motion.a
                            variants={fadeUp}
                            transition={{duration: 0.5}}
                            href="https://www.youtube.com/watch?v=Joaz3GdkBVA"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...linkStyle,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "#d0c0b0",
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.98}}
                        >
                            <OndemandVideo fontSize="small"/>
                            Watch Talk
                        </motion.a>
                    </Stack>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function LambdaFSPage() {
    return (
        <div style={{
            background: "#0d0808",
            color: "#f0e8e0",
            fontFamily: "var(--font-roboto), sans-serif",
            overflowX: "hidden",
        }}>
            <Fab
                color="info"
                aria-label="Go back"
                component={Link}
                href="/"
                sx={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    zIndex: 100,
                }}
            >
                <ArrowBack/>
            </Fab>

            <HeroSection/>
            <ProblemSection/>
            <TradeoffSection/>
            <SolutionSection/>
            <ArchitectureSection/>
            <ResultsSection/>
            <ImplementationSection/>
            <CTASection/>

            <footer style={{
                textAlign: "center",
                padding: "3rem 2rem",
                color: "#5a4a3a",
                fontSize: "0.85rem",
                background: "#0d0808",
            }}>
                Published at ASPLOS 2023 &middot; arXiv:2306.11877
            </footer>
        </div>
    );
}
