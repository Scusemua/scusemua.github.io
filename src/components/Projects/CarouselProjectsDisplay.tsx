import {Project} from "@data/ProjectsData";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import React from "react";
import EmblaCarousel from "@src/components/Carousel/EmblaCarousel";
import styles from "@styles/components/Projects.module.scss";
import {motion} from "framer-motion";
import ProjectCard from "@src/components/Projects/ProjectDisplay";

const cardVariant = {
    hidden: {
        y: 10,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

const CarouselProjectsDisplay = ({projects, dark_card_actions}: { projects: Project[], dark_card_actions?: boolean}) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [expandedProjects, setExpandedProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

    React.useEffect(() => {
        projects.forEach((project: Project) => {
            setExpandedProjects(prev => new Map(prev).set(project.name, false));
        })
    }, [projects])

    const onProjectSelectedIndexChanged = (selectedIndex: number) => {
        projects.forEach((project: Project, index: number) => {
            if (selectedIndex === index) {
                return;
            }

            if (expandedProjects.get(project.name)) {
                setExpandedProjects(prev => new Map(prev).set(project.name, false));
            }
        })
    }

    const toggleProjectExpanded = (name: string, expanded: boolean) => {
        setExpandedProjects(prev => new Map(prev).set(name, expanded));
    }

    const getHoverScale = () => {
        if (mq_xs) {
            return {scale: 1.0}
        }

        if (mq_md_or_less) {
            return {scale: 1.025}
        }

        return {scale: 1.05}
    }

    return (
        <EmblaCarousel className={styles.projects_container}
                       slides={projects.map((project: Project, idx: number) => {
                           return (
                               <motion.div
                                   variants={cardVariant}
                                   style={{
                                       width: "100%",
                                   }}
                                   whileHover={!mq_xs ? getHoverScale() : undefined}
                                   key={`project-${project.name}-display-${idx}`}>
                                   <ProjectCard key={`project-${idx}-${project.name}`}
                                                project={project}
                                                is_xs={mq_md_or_less}
                                                is_xl={mq_xl}
                                                toggleExpansion={toggleProjectExpanded}
                                                expanded={expandedProjects.get(project.name) || false}
                                                dark_card_actions={dark_card_actions}
                                   />
                               </motion.div>
                           );
                       })}
                       autoplayEnabled={true}
                       onSelectedIndexChanged={onProjectSelectedIndexChanged}
                       options={{
                           loop: true,
                       }}
        />
    );
}

export default CarouselProjectsDisplay;