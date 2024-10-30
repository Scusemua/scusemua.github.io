import styles from "@src/styles/components/Projects.module.scss";

import React, {ReactElement, ReactNode} from "react";

import {
    Badge,
    Card,
    CardActions,
    CardContent, CardHeader,
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
import Image from "next/image";

interface ProjectProps {
    project: Project;
}

const openInNewTab = (url: string | URL | undefined) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

const badgeColors: string[] = ["#F05D5E", "#3D3E78"]

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const getPaperLinks = () => {
        return <Stack
            direction={{xs: "column", sm: "row", md: "row", lg: "row", xl: "row"}}
            spacing={{xs: 0, sm: 3, md: 3, lg: 3, xl: 3}}
            justifyContent={"center"}
            alignItems={"center"}
        >
            {props.project.arxiv_links.map((arxiv_url: string, idx: number) => {
                let badgeContent: ReactNode;
                if (props.project.arxiv_links.length === 1) {
                    badgeContent = (<Typography variant={"body2"}>
                        {props.project.venue as string}
                    </Typography>);
                } else {
                    badgeContent = (<Typography variant={"body2"}>
                        {(props.project.venue as string[])[idx]}
                    </Typography>);
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
            })}
        </Stack>
    }

    const getStatusIcon = (): ReactElement => {
        if (props.project.status === 'ongoing') {
            return <TerminalIcon/>
        } else {
            return <BedtimeIcon/>
        }
    }

    const getStatusColor = (): "info" | "default" => {
        if (props.project.status === 'ongoing') {
            return "info"
        } else {
            return "default"
        }
    }

    const keywords = (
        <div className={styles.project_keywords}>
            {props.project.keywords.map((keyword: string) => (
                <Chip key={`project-${props.project.name}-keyword-${keyword}`} className={styles.project_keyword}
                      label={keyword} size={'small'}/>
            ))}
            {props.project.builtWith?.map((keyword: string) => (
                <Chip key={`project-${props.project.name}-keyword-${keyword}`} className={styles.project_keyword}
                      label={keyword} size={'small'} variant={'outlined'}/>
            ))}
        </div>
    );

    const cardHeader = (
        <CardHeader
            title={
                <Stack direction={{xs: "column", sm: "row"}} spacing={1} sx={{
                    justifyContent: "center",
                    alignItems: 'center',
                    paddingBottom: "1rem",
                }}>
                    <Typography gutterBottom sx={{typography: {xs: 'h4', sm: 'h4', md: "h3", lg: "h3", xl: "h3"}}}
                                component="div">{props.project.name}</Typography>
                    <Chip label={props.project.status} icon={getStatusIcon()} color={getStatusColor()}/>
                </Stack>}
            subheader={
                <div style={{width: "90%", margin: "0 auto"}}>
                    <Typography variant="body1"
                                sx={{color: 'text.secondary', fontSize: "1.25rem"}}>
                        {props.project.description}
                    </Typography>
                </div>
            }
            sx={{
                marginBottom: 'auto',
            }}
        >
        </CardHeader>
    );

    const cardActions = (
        <CardActions sx={{
            justifyContent: 'center',
            marginTop: 'auto',
        }}>
            <Stack direction={'column'} spacing={1} justifyContent={"center"} alignItems={"center"}>
                {keywords}
                <Stack direction={'row'} spacing={{xs: 0, sm: 3, md: 3, lg: 3, xl: 3}} justifyContent={"center"}
                       alignItems={"center"}>
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
        <Card className={styles.project_section_card}>
            <div style={{width: '100%', background: "#1C192E"}}>
                <CardMedia>
                    <div style={{
                        position: 'relative',
                        margin: "0 auto",
                        width: '100%',
                        height: '200px',
                        zIndex: 5,
                    }}>
                        <Image
                            src={props.project.image}
                            fill
                            alt="Project Logo"
                            style={{objectFit: 'contain'}}
                        />
                    </div>
                </CardMedia>
            </div>
            {cardHeader}
            {cardActions}
        </Card>
    );
};
export default ProjectDisplay;