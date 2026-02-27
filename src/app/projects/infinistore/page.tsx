'use client';

import React from "react";
import {motion, useScroll, useTransform} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {Fab, Stack} from "@mui/material";
import {ArrowBack, GitHub, Description} from "@mui/icons-material";
import infinistoreLogo from "@images/logos/infinistore_logo.webp";

const GRADIENT = "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)";
const ACCENT = "#06b6d4";

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
        <div ref={ref} style={{...sectionStyle, background: "#060a10", minHeight: "100vh"}}>
            <motion.div style={{opacity, scale, y, textAlign: "center"}}>
                <motion.div
                    initial={{opacity: 0, scale: 0.7}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    style={{marginBottom: "2rem"}}
                >
                    <Image
                        src={infinistoreLogo}
                        alt="InfiniStore Logo"
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
                        color: "#7098b0",
                        fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                        maxWidth: "640px",
                        lineHeight: 1.7,
                        margin: "0 auto",
                    }}
                >
                    A persistent, elastic cloud storage system powered by serverless function memory
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
                    <p style={{color: "#3a4a5a", fontSize: "0.85rem", marginTop: "0.5rem"}}>Scroll to explore</p>
                </motion.div>
            </motion.div>
        </div>
    );
}

function ProblemSection() {
    return (
        <div style={{...sectionStyle, background: "#070b12"}}>
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
                        color: "#e0eaf0",
                        fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        margin: "0 0 2rem",
                    }}
                >
                    Fast storage is{" "}
                    <span style={{
                        background: GRADIENT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        expensive
                    </span>
                    {". "}Cheap storage is{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        slow
                    </span>
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#708898",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        lineHeight: 1.8,
                        maxWidth: "750px",
                        margin: "0 auto",
                    }}
                >
                    Cloud object storage like AWS S3 is cost-effective and highly elastic but
                    relatively slow. High-performance cloud storage like AWS ElastiCache delivers
                    speed but is expensive and provides limited elasticity. Neither option alone
                    gives you the best of both worlds.
                </motion.p>
            </motion.div>
        </div>
    );
}

function SpectrumSection() {
    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #070b12 0%, #080d14 100%)",
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
                    The Storage Spectrum
                </motion.p>

                <motion.h2
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#e0eaf0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        textAlign: "center",
                        margin: "0 auto 3rem",
                        maxWidth: "850px",
                    }}
                >
                    A gap between performance and cost
                </motion.h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem",
                    maxWidth: "900px",
                    margin: "0 auto",
                }}>
                    {[
                        {
                            title: "Object Storage (S3)",
                            traits: "Low cost · Highly elastic · Persistent",
                            problem: "High latency makes it unsuitable for performance-sensitive workloads that need fast random access.",
                            color: "#06b6d4",
                        },
                        {
                            title: "Managed Cache (ElastiCache)",
                            traits: "Low latency · High throughput · In-memory",
                            problem: "Expensive at scale, limited elasticity, and users pay for provisioned capacity even when idle.",
                            color: "#8b5cf6",
                        },
                        {
                            title: "The Missing Layer",
                            traits: "Fast · Elastic · Cheap · Persistent",
                            problem: "What if serverless function memory could bridge this gap — offering in-memory speed at near-object-storage cost?",
                            color: "#ec4899",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            variants={fadeUp}
                            transition={{duration: 0.6, delay: i * 0.15}}
                            style={{
                                background: `${item.color}08`,
                                border: `1px solid ${item.color}22`,
                                borderRadius: "16px",
                                padding: "2rem",
                            }}
                        >
                            <h3 style={{
                                color: "#d0dce8",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                marginBottom: "0.4rem",
                                marginTop: 0,
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: item.color,
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                letterSpacing: "0.05em",
                                marginBottom: "0.75rem",
                            }}>
                                {item.traits}
                            </p>
                            <p style={{
                                color: "#607888",
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                margin: 0,
                            }}>
                                {item.problem}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function ServerlessMemorySection() {
    return (
        <div style={{...sectionStyle, background: "#080d14"}}>
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
                    Key Innovation
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
                    Memory
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7, delay: 0.3}}
                    style={{
                        color: "#708898",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        lineHeight: 1.8,
                        maxWidth: "700px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    InfiniStore introduces{" "}
                    <em style={{color: "#a0c0d0"}}>ServerlessMemory</em> — a storage layer that
                    stores data using the memory of serverless cloud functions. Inspired by
                    programming-language garbage collection, it employs a sliding-window memory
                    management strategy to effectively segregate hot and cold data.
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
                    {["Fine-grained Elasticity", "Pay-per-Access", "Hot/Cold Separation", "GC-Inspired"].map((label) => (
                        <motion.span
                            key={label}
                            variants={fadeUp}
                            transition={{duration: 0.4}}
                            style={{
                                background: `rgba(6, 182, 212, 0.12)`,
                                border: `1px solid rgba(6, 182, 212, 0.25)`,
                                borderRadius: "999px",
                                padding: "0.6rem 1.4rem",
                                color: "#80b8cc",
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
            icon: "🧠",
            title: "Function Memory as Storage",
            description: "Uses the ephemeral memory of serverless functions as a fast, elastic storage tier — no provisioned capacity, no idle cost.",
        },
        {
            icon: "♻️",
            title: "GC-Inspired Data Management",
            description: "A sliding-window strategy, inspired by garbage-collection techniques, automatically migrates cold data to cheap persistent storage while keeping hot data in fast function memory.",
        },
        {
            icon: "🔄",
            title: "Fast Parallel Recovery",
            description: "Ensures durability despite function failures with a parallel recovery scheme that leverages FaaS autoscaling for rapid, concurrent data reconstruction.",
        },
        {
            icon: "🔗",
            title: "Tiered Coupling",
            description: "Seamlessly couples the ServerlessMemory layer with a persistent cloud object store (S3), providing both high performance and durability transparently.",
        },
    ];

    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #080d14 0%, #070b12 100%)",
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
                        color: "#e0eaf0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        textAlign: "center",
                        marginBottom: "3rem",
                        marginTop: 0,
                    }}
                >
                    Two tiers, one seamless system
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
                                color: "#d0dce8",
                                fontSize: "1.15rem",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                                marginTop: 0,
                            }}>
                                {pillar.title}
                            </h3>
                            <p style={{
                                color: "#607888",
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
                color: "#607888",
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
        <div style={{...sectionStyle, background: "#070b12"}}>
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
                        color: "#e0eaf0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        marginTop: 0,
                    }}
                >
                    Performance at a fraction of the cost
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7, delay: 0.1}}
                    style={{
                        color: "#607888",
                        fontSize: "1.1rem",
                        maxWidth: "650px",
                        margin: "0 auto 3rem",
                    }}
                >
                    Evaluated with microbenchmarks and real-world applications, InfiniStore
                    delivers competitive performance while dramatically reducing tenant-side costs.
                </motion.p>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.4}}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "0.5rem",
                        maxWidth: "750px",
                        margin: "0 auto 3rem",
                    }}
                >
                    <StatCard value="97.24%" label="Cost savings vs ElastiCache" delay={0}/>
                    <StatCard value="26.25%" label="Cost savings vs InfiniCache" delay={0.15}/>
                </motion.div>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7, delay: 0.3}}
                    style={{
                        color: "#708898",
                        fontSize: "clamp(1rem, 2vw, 1.15rem)",
                        lineHeight: 1.8,
                        maxWidth: "700px",
                        margin: "0 auto",
                    }}
                >
                    InfiniStore shows the strongest performance benefits for objects larger than
                    10 MB — delivering throughput competitive with AWS ElastiCache and Anna while
                    also providing durability, elasticity, and a pay-per-access pricing model.
                </motion.p>
            </motion.div>
        </div>
    );
}

function ImplementationSection() {
    return (
        <div style={{
            ...sectionStyle,
            background: "linear-gradient(180deg, #070b12 0%, #080d14 100%)",
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
                        color: "#e0eaf0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "2rem",
                        marginTop: 0,
                    }}
                >
                    Built on AWS, proven in production workloads
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.7}}
                    style={{
                        color: "#708898",
                        fontSize: "clamp(1rem, 2vw, 1.15rem)",
                        lineHeight: 1.8,
                        marginBottom: "2.5rem",
                    }}
                >
                    InfiniStore is implemented in Golang and Python, coupling AWS Lambda
                    functions as the fast ServerlessMemory tier with AWS S3 for persistence.
                    The system was evaluated against AWS ElastiCache (Redis) and Anna using
                    both microbenchmarks and two real-world applications.
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
                    {["AWS Lambda", "AWS S3", "AWS ElastiCache", "Redis", "Golang", "Python"].map((tech) => (
                        <span
                            key={tech}
                            style={{
                                background: `rgba(6, 182, 212, 0.08)`,
                                border: `1px solid rgba(6, 182, 212, 0.2)`,
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                                color: "#80a0b0",
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
            background: "#080d14",
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
                        color: "#e0eaf0",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        marginTop: 0,
                    }}
                >
                    Explore InfiniStore
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    transition={{duration: 0.6, delay: 0.1}}
                    style={{
                        color: "#607888",
                        fontSize: "1.1rem",
                        maxWidth: "500px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    Read the paper or explore the source code.
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
                            href="https://arxiv.org/abs/2209.01496"
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
                            href="https://github.com/ds2-lab/infinistore"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...linkStyle,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "#a0b8c8",
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.98}}
                        >
                            <GitHub fontSize="small"/>
                            View Source
                        </motion.a>
                    </Stack>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function InfiniStorePage() {
    return (
        <div style={{
            background: "#060a10",
            color: "#e0eaf0",
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
            <SpectrumSection/>
            <ServerlessMemorySection/>
            <ArchitectureSection/>
            <ResultsSection/>
            <ImplementationSection/>
            <CTASection/>

            <footer style={{
                textAlign: "center",
                padding: "3rem 2rem",
                color: "#3a4a5a",
                fontSize: "0.85rem",
                background: "#060a10",
            }}>
                Published at VLDB 2023 &middot; arXiv:2209.01496
            </footer>
        </div>
    );
}
