import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';

const CustomDialogStyled = styled(Dialog)(({ theme }) => ({
    // '& .MuiDialogContent-root': {
    //     padding: theme.spacing(2),
    // },
    // '& .MuiDialogActions-root': {
    //     padding: theme.spacing(1),
    // },
}));

function CustomDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

CustomDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function CustomDialog({ 
    isDialogOpen, 
    setDialogOpen,
    header,
    footer,
    action,
    className,
    isFormattedDialog=true,
    logoUrl,
    subFooter,
    ...props
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const webDetails = useSelector(state => state.webDetails);
    const { websiteInfo } = webDetails;

    return (
        <div>
           <CustomDialogStyled
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={isDialogOpen}
                fullScreen={fullScreen}
                className={className}
            >
                <CustomDialogTitle 
                    id="customized-dialog-title"
                    onClose={handleClose}>
                        {isFormattedDialog ?
                            <div className="dialog-title">
                                <div className="logo-wrapper">
                                    {/* <img src={require('../../assets/images/logo.png')} alt="logo" /> */}
                                    <img src={logoUrl} alt="logo" />
                                </div>
                                <span className="title">
                                    {/* Welcome to {process.env.REACT_APP_STORE_NAME}!!<br /> */}
                                    Welcome to {_.get(websiteInfo, 'store_name')}!<br />
                                </span>
                                {header}
                            </div> : <div className="formatted-title dialog-title">
                                {header}
                            </div> }
                </CustomDialogTitle>
                {props.children}
                {footer}
                {subFooter}
            </CustomDialogStyled>
        </div>
    );
}