import React from "react";
import { Modal, Typography, withStyles } from "@material-ui/core";
import styles from "./modal.style";
/**
 *
 * @param {Object} props
 * @todo Add accessiblity(arial labels, etc)
 * @todo Refactor the Modal's containers to improve performance
 */
const WalletModal = props => {
    const { type, open, handleClose, classes } = props;

    return (
        <Modal open={open} onClose={handleClose}>
            <div className={classes.paper}>
                <Typography variant="h6">
                    How much DAI do you want to {type}?
                </Typography>
            </div>
        </Modal>
    );
};

export default withStyles(styles, { withTheme: true })(WalletModal);
