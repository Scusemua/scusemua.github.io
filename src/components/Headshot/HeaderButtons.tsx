import React from "react";
import {Button, Stack, Tooltip} from "@mui/material";
import styles from "@styles/components/Headshot.module.scss";
import Image from "next/image";
import {PersonalData} from "@data/PersonalData";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import MailIcon from "@mui/icons-material/Mail";

const HeaderButtons: React.FunctionComponent = () => {
    const downloadResume = () => {
        const link = document.createElement("a");
        link.download = 'CarverBenjamin_Resume.pdf';
        link.href = 'CarverBenjamin_Resume.pdf'
        link.click();
    }

    const viewResume = () => {
        window.open('CarverBenjamin_Resume.pdf');
    }

    return (
        <Stack className={styles.headshot_cv_button_stack} spacing={2} key={"headshot_header_buttons"}
               direction={{'xs': 'column', 'sm': 'row', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <Tooltip title={"View a PDF copy of my resume"} arrow>
                <Button variant={"contained"} color={'secondary'} onClick={viewResume}
                        startIcon={<DownloadIcon style={{color: "#322364"}}/>} style={{height: 45, width: "16rem"}}
                        aria-label={"View my Resume Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem", color: "#322364"}}>
                        View my Resume
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                <Button variant={"contained"} color={'primary'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                        rel="noopener noreferrer" startIcon={<MailIcon style={{color: "white"}}/>}
                        style={{height: 45, width: "12rem"}}
                        aria-label={"Contact Me Button"}>
                    <Typography variant={"button"} align={"center"} style={{fontSize: "1rem", color: "white"}}>
                        Contact Me
                    </Typography>
                </Button>
            </Tooltip>
        </Stack>
    );
}

export default HeaderButtons;