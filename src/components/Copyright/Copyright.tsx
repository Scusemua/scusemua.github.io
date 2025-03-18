import React from 'react';
import Typography from "@mui/material/Typography";
import styles from "@src/styles/components/Copyright.module.scss";
import {Button, Stack} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const CopyrightNotice = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.copyright}>
            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
                <Typography className={styles.copyright_text} variant="body2">
                    &copy; {currentYear} Benjamin Carver. All rights reserved.
                </Typography>
            </Stack>
        </div>
    );
};

export default CopyrightNotice;