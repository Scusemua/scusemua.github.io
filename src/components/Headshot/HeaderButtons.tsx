import React from "react";
import {Button, Stack, Tooltip} from "@mui/material";
import styles from "@styles/components/Headshot.module.scss";
import Image from "next/image";
import {PersonalData} from "@data/PersonalData";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import MailIcon from "@mui/icons-material/Mail";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const HeaderButtons: React.FunctionComponent = React.memo(() => {
    const viewResume = React.useCallback(() => {
        window.open('CarverBenjamin_Resume.pdf');
    }, []);

    return (
        <Stack className={styles.headshot_cv_button_stack} spacing={2} key={"headshot_header_buttons"}
               direction={{'xs': 'column', 'sm': 'row', 'md': 'row', 'lg': 'row', 'xl': 'row'}}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <Tooltip title={"View a PDF copy of my resume"} arrow>
                <Button variant={"contained"} color={'secondary'} onClick={viewResume}
                        startIcon={<DownloadIcon style={{color: "#322364"}}/>}
                        sx={{height: {xs: 40, sm: 45}, width: {xs: "14rem", sm: "16rem"}, maxWidth: "90vw"}}
                        aria-label={"View my Resume Button"}>
                    <Typography variant={"button"} align={"center"} sx={{fontSize: {xs: "0.85rem", sm: "1rem"}, color: "#322364"}}>
                        View my Resume
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"Email me (bcarver2@gmu.edu)"} arrow>
                <Button variant={"contained"} color={'primary'} href={`mailto:bcarver2@gmu.edu`} target="_top"
                        rel="noopener noreferrer" startIcon={<MailIcon style={{color: "white"}}/>}
                        sx={{height: {xs: 40, sm: 45}, width: {xs: "14rem", sm: "12rem"}, maxWidth: "90vw"}}
                        aria-label={"Contact Me Button"}>
                    <Typography variant={"button"} align={"center"} sx={{fontSize: {xs: "0.85rem", sm: "1rem"}, color: "white"}}>
                        Contact Me
                    </Typography>
                </Button>
            </Tooltip>
            <Tooltip title={"Explore my interactive 3D portfolio"} arrow>
                <Button variant={"outlined"} href={"/orbital/index.html"} target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<RocketLaunchIcon style={{color: "#ffffff"}}/>}
                        sx={{height: {xs: 40, sm: 45}, width: {xs: "14rem", sm: "16rem"}, maxWidth: "90vw", borderColor: "#ffffff"}}
                        aria-label={"Explore 3D Portfolio"}>
                    <Typography variant={"button"} align={"center"} sx={{fontSize: {xs: "0.85rem", sm: "1rem"}, color: "#ffffff"}}>
                        3D Portfolio
                    </Typography>
                </Button>
            </Tooltip>
        </Stack>
    );
});

HeaderButtons.displayName = "HeaderButtons";

export default HeaderButtons;