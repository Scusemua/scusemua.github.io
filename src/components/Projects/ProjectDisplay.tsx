import styles from "@src/styles/components/Projects.module.scss";

import React, {ReactElement} from "react";

import {
    Badge,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Grid2,
    Stack,
    Tooltip
} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project} from "@data/ProjectsData";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from '@mui/icons-material/Article';
import WebIcon from '@mui/icons-material/Web';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TerminalIcon from '@mui/icons-material/Terminal';
import {Variants, motion} from "framer-motion";
import Image from "next/image";

interface ProjectProps {
    project: Project;
}

const openInNewTab = (url: string | URL | undefined) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

const projectCardAnimationVariant: Variants = {
    initial: {
        opacity: 0,
        x: "-50%",
    },
    animate: {
        opacity: 1,
        x: "0%",
        transition: {
            type: 'spring',
            stiffness: 25,
            damping: 100,
            mass: 100,
            delay: 0.5,
        },
    },
};

const badgeColors: string[] = ["#F05D5E", "#3D3E78"]

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const getPaperLinks = () => {
        return props.project.arxiv_links.map((arxiv_url: string, idx: number) => {
            let badgeContent: string = "";
            if (props.project.arxiv_links.length === 1) {
                badgeContent = props.project.venue as string;
            } else {
                badgeContent = (props.project.venue as string[])[idx];
            }

            return (<Tooltip title={`View Paper on arXiv`} arrow key={`paper-icon-${idx}`}>
                <IconButton size="large"
                            onClick={() => openInNewTab(arxiv_url)}>
                    <Badge sx={{
                        "& .MuiBadge-badge": {
                            color: "#fff",
                            backgroundColor: badgeColors[idx],
                        }
                    }} badgeContent={badgeContent} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'right',
                    }}>
                        <ArticleIcon fontSize="inherit"/>
                    </Badge>
                </IconButton>
            </Tooltip>);
        })
    }

    const getStatusIcon = (): ReactElement => {
        if (props.project.status == 'active') {
            return <TerminalIcon/>
        } else {
            return <BedtimeIcon/>
        }
    }

    const getStatusColor = (): "info" | "default" => {
        if (props.project.status == 'active') {
            return "info"
        } else {
            return "default"
        }
    }

    const keywords = (
        <div className={styles.project_keywords}>
            {props.project.keywords.map((keyword: string) => (
                <Chip key={`project-${props.project.name}-keyword-${keyword}`} className={styles.project_keyword}
                      label={keyword} size={'small'} variant={'outlined'}/>
            ))}
        </div>
    );

    const cardActions = (
        <CardActions sx={{
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Stack>
                <Stack direction={'row'} spacing={2} sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {props.project.repo_url !== "" && <Tooltip title={"GitHub"} arrow>
                        <IconButton aria-label={"GitHub Repo"} size="large"
                                    onClick={() => openInNewTab(props.project.repo_url)}
                                    color={"default"}>
                            <GitHubIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>}
                    {props.project.project_website_url !== "" && <Tooltip title={`Project Website`} arrow>
                        <IconButton size="large"
                                    onClick={() => openInNewTab(props.project.project_website_url)}>
                            <WebIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>}
                    {getPaperLinks()}
                </Stack>
            </Stack>
        </CardActions>
    )

    return (
        <div className={styles.project}>
            <Stack
                direction={"column"}
                spacing={2} sx={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <motion.div variants={projectCardAnimationVariant}
                            whileHover={{
                                scale: 1.05,
                            }}>
                    <Card style={{height: 545}}>
                        <CardMedia sx={{position: 'relative'}}>
                            <div style={{position: 'relative', width: '100%', height: '225px'}}>
                                <Image
                                    src={props.project.image}
                                    fill
                                    alt="Project Logo"
                                    style={{objectFit: 'cover'}}
                                />
                            </div>
                        </CardMedia>
                        <CardContent>
                            <Stack direction={"row"} spacing={2} sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: '0.5rem',
                            }}>
                                <Typography gutterBottom variant="h5" component="div">{props.project.name}</Typography>
                                <Chip label={props.project.status} icon={getStatusIcon()} color={getStatusColor()}
                                      size={'small'}/>
                            </Stack>
                            <Typography className={styles.project_description} variant="body2"
                                        sx={{color: 'text.secondary'}}>
                                {props.project.description}
                            </Typography>
                            {keywords}
                        </CardContent>
                        {cardActions}
                    </Card>
                </motion.div>
            </Stack>
        </div>
    );
};
export default ProjectDisplay;