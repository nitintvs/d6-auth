import { useEffect } from 'react'

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
            <div className="img-wrapper">
                <img src={require('../../assets/images/LoadInProgress.jpg')} slt="" />
                <h2>Load In Progress . . .</h2>
            </div>
        </div>
    )
}

export default LoadWebsite