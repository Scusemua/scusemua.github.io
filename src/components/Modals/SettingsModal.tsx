import React from "react";
import {
    Modal,
    Box,
    Slider,
    Typography,
    Button,
    IconButton, Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {DefaultRotationMultiplier, MaxRotationMultiplier, useSettings} from "@src/components/Context/SettingsContext";

// Modal styles
const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({open, onClose}) => {
    const {rotationMultiplier, setRotationMultiplier} = useSettings();

    const handleSliderChange = (_: Event, value: number | number[]) => {
        setRotationMultiplier(value as number);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-settings-title">
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography id="modal-settings-title" variant="h6" component="h2">
                        Adjust Card Rotation Multiplier
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Typography gutterBottom>
                    Card Rotation Multiplier: {rotationMultiplier.toFixed(1)}
                </Typography>
                <Box mt={3} sx={{
                    paddingBottom: "25px",
                    textAlign: "center",
                }}>
                    <Slider
                        value={rotationMultiplier}
                        onChange={handleSliderChange}
                        min={0}
                        max={MaxRotationMultiplier}
                        sx={{
                            width: "90%",
                            textAlign: "center",
                            margin: "0 auto",
                        }}
                        step={1.0}
                        marks={[
                            {value: DefaultRotationMultiplier, label: `Default (${DefaultRotationMultiplier})`},
                            {value: MaxRotationMultiplier, label: `Max (${MaxRotationMultiplier})`}
                        ]}
                        valueLabelDisplay="auto"
                    />
                </Box>

                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Stack direction={"row"} spacing={2} style={{margin: "0 auto"}}>
                        <Button onClick={() => setRotationMultiplier(DefaultRotationMultiplier)} variant="contained"
                                color="primary">
                            Restore Default
                        </Button>
                        <Button onClick={onClose} variant="contained" color="success">
                            Save & Close
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default SettingsModal;
