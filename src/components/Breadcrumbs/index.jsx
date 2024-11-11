import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { useNavigate } from 'react-router-dom';

function handleClick(event) {
    // event.preventDefault();
    // console.info('You clicked a breadcrumb.');
}

export default function CustomBreadcrumbs ({ showIcon = false, list = [], name }) {
    const navigate = useNavigate();
    
    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                {list.map(breadcrumb => (
                    <Link
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        onClick={() => navigate(breadcrumb.path)}
                    >
                        {breadcrumb.name === 'Home' ? 
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> :
                            breadcrumb.name
                        }
                    </Link>
                ))}

                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                >
                    {name}
                </Typography>
                
            
            {/* <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
                color="inherit"
                href="/material-ui/getting-started/installation/"
            >
                <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Core
            </Link> */}
                
            </Breadcrumbs>
        </div>
    );
}