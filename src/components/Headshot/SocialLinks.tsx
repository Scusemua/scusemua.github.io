import React from "react";

import styles from "@src/styles/components/Headshot.module.scss";

import {Stack, Tooltip, useMediaQuery} from "@mui/material";

import IconButton from '@mui/material/IconButton';

import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import theme from "@src/app/theme";
import Link from "next/link";
import {SettingsRounded} from "@mui/icons-material";

interface SocialLinksProps {
    onClickSettingsButton: () => void;
}

const SocialLinks: React.FunctionComponent<SocialLinksProps> = (props: SocialLinksProps) => {
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    return (
        <div className={styles.social_links_container}>
            <Stack
                direction={"row"}
                spacing={1}
                style={{zIndex: 2, justifyContent: "center", alignItems: "center"}}
            >
                <Tooltip title={"GitHub"} arrow>
                    <IconButton aria-label={"GitHub"} size="large" component={Link}
                                href={'https://github.com/scusemua/'} color={"default"}>
                        <GitHubIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Email Me (bcarver2@gmu.edu)"} arrow>
                    <IconButton size="large" href={'mailto:bcarver2@gmu.edu'}
                                component={Link} >
                        <MailIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"LinkedIn"} arrow>
                    <IconButton size="large" component={Link}
                                href={'https://www.linkedin.com/in/benjamin-carver-phd-30988a1b6/'}>
                        <LinkedInIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"YouTube"} arrow>
                    <IconButton size="large" component={Link}
                                href={'https://www.youtube.com/@benrcarver'}>
                        <YouTubeIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Google Scholar"} arrow>
                    <IconButton size="large" component={Link}
                                href={'https://scholar.google.com/citations?user=sCOVuPEAAAAJ&hl=en'}>
                        <SchoolIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                {mq_xl && <Tooltip title={"Settings"} arrow>
                    <IconButton size="large" onClick={props.onClickSettingsButton} >
                        <SettingsRounded fontSize="inherit"/>
                    </IconButton>
                </Tooltip>}
            </Stack>
        </div>
    );
}

export default SocialLinks;