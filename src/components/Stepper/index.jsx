import {
    Step,
    Stepper,
    StepLabel
} from '@mui/material';
import PropTypes from 'prop-types';

import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { styled } from '@mui/material/styles';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));
  
function ColorlibStepIcon(props) {
    const { active, completed, className, icon } = props;
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icon}
      </ColorlibStepIconRoot>
    );
}

// ColorlibStepIcon.propTypes = {
//     /**
//      * Whether this step is active.
//      * @default false
//      */
//     active: PropTypes.bool,
//     className: PropTypes.string,
//     /**
//      * Mark the step as completed. Is passed to child components.
//      * @default false
//      */
//     completed: PropTypes.bool,
//     /**
//      * The label displayed in the step icon.
//      */
//     icon: PropTypes.node,
// };

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const CustomStepper = ({ steps, completedStep, activeStep }) => {
    return (
        <Stepper alternativeLabel activeStep={activeStep - 1} connector={<ColorlibConnector />}>
            {steps.map((step) => (
                <Step key={step.label}>
                    <StepLabel StepIconComponent={() =>
                        <ColorlibStepIcon 
                            active={completedStep == step.completedStep} 
                            completed={step.statusId <= completedStep} 
                            icon={step.icon} />
                    }>{step.label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}


{/* <ColorlibStepIcon 
active={true} 
completed={true} 
icon={step.icon} /> */}


export default CustomStepper