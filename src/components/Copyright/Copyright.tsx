import React from 'react';
import Typography from "@mui/material/Typography";
import styles from "@src/styles/components/Copyright.module.scss";

const CopyrightNotice = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.copyright}>
            <Typography className={styles.copyright_text} variant="body2">
                &copy; {currentYear} Benjamin Carver. All rights reserved.
            </Typography>
        </div>
    );
};

export default CopyrightNotice;