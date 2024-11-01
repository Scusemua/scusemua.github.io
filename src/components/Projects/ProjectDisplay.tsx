import styles from "@src/styles/components/Projects.module.scss";

import React, {ReactElement, ReactNode} from "react";

import {
    Badge,
    Card, CardActionArea,
    CardActions, CardContent,
    CardHeader,
    CardMedia,
    Chip, Collapse,
    IconButtonProps,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import PresentationIcon from "@icons/presentation";

interface ProjectProps {
    project: Project;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const openInNewTab = (url: string | URL | undefined) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

const badgeColors: string[] = ["#F05D5E", "#3D3E78"]

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const [cardWidth, setCardWidth] = React.useState<number>(-1);

    const nodeRef = React.useRef<any>(null);

    React.useEffect(() => {
        window.addEventListener("resize", () => {
            if (nodeRef.current !== null) {
                setCardWidth(nodeRef.current.getBoundingClientRect().width);
            }
        });
    }, []);

    const cardRefCallback = React.useCallback((node: any) => {
        if (node !== null) {
            setCardWidth(node.getBoundingClientRect().width);

            nodeRef.current = node;
        }
    }, []);

    const getPaperLinks = () => {
        return <Stack
            direction="row"
            spacing={{xs: 3, sm: 3, md: 3, lg: 3, xl: 3}}
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
                <Stack direction={{xs: "row", sm: "row"}}
                       className={styles.project_section_card_header}
                       spacing={1}
                >
                    <Typography gutterBottom sx={{typography: {xs: 'h5', sm: 'h5', md: "h4", lg: "h4", xl: "h4"}}}
                                component="div">{props.project.name}</Typography>
                    <Chip label={props.project.status} icon={getStatusIcon()} color={getStatusColor()}/>
                </Stack>}
            // subheader={
            //     <div style={{
            //         width: "90%", margin: "0 auto",
            //         justifyContent: "center",
            //         alignItems: 'center',
            //         paddingBottom: "1rem"
            //     }}>
            //         <div style={{
            //             width: expanded ? "100%" : cardWidth * .90,
            //             margin: "0 auto",
            //             justifyContent: "center",
            //             alignItems: 'center',
            //         }}>
            //             <Typography variant="body1" noWrap={!expanded} style={{
            //                 width: expanded ? "100%" : cardWidth * .90,
            //                 margin: "0 auto"
            //             }}>
            //                 {props.project.description}
            //             </Typography>
            //         </div>
            //         <Collapse in={expanded} timeout={"auto"} unmountOnExit>
            //             {keywords}
            //         </Collapse>
            //     </div>
            // }
        >
        </CardHeader>
    );

    const onClickCard = () => {
        setExpanded(!expanded);
    }

    const cardActions = (
        <CardActions disableSpacing>
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
            {props.project.presentation_url && props.project.presentation_url !== "" &&
                <Tooltip title={`Paper Presentation (${props.project.presentation_venue})`} arrow>
                    <IconButton size="large"
                                onClick={() => openInNewTab(props.project.presentation_url)}>
                        <PresentationIcon fill={"#757575"} fontSize="inherit"/>
                    </IconButton>
                </Tooltip>}
            {getPaperLinks()}
            <IconButton size="large" style={{marginLeft: "auto"}}
                        onClick={() => onClickCard()}>
                <ExpandMoreIcon fontSize="inherit" style={{transform: (expanded ? "rotate(180deg)" : "")}}/>
            </IconButton>
        </CardActions>
    )

    return (
        <Card ref={cardRefCallback}
              style={{height: (expanded ? "auto" : "100%")}}
              className={styles.project_section_card}
        >
            <CardActionArea onClick={() => onClickCard()}>
                <div style={{width: '100%', background: "#1C192E"}}>
                    <CardMedia>
                        <div style={{
                            position: 'relative',
                            margin: "0 auto",
                            width: '100%',
                            height: '150px',
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
                <CardContent>
                    <Typography variant="body1">
                        {props.project.description}
                    </Typography>
                    <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                        {keywords}
                    </Collapse>
                </CardContent>
                {cardActions}
            </CardActionArea>
        </Card>
    );
};
export default ProjectDisplay;