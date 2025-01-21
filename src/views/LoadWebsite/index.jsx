import { useEffect } from 'react'
import LoadInProgress from '../../assets/images/LoadInProgress.jpg';
import { Grid } from '@mui/material';
const LoadWebsite = ({ activate }) => {
    useEffect(() => {
        if (activate) {
            document.getElementById("overlay").style.display = "block"
        } else {
            document.getElementById("overlay").style.display = "none"
        }
    }, [activate])

    return (
        <div id="overlay" className="overlay-wrapper">
            <Grid className="img-wrapper">
                <img src={require('../../assets/images/LoadInProgress.jpg')} slt="" />
                <h2>Load In Progress . . .</h2>
            </Grid>
        </div>
    )
}

export default LoadWebsite