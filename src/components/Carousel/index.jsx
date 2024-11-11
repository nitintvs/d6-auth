import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import '@splidejs/react-splide/css';
// 
// or other themes
// import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';
import { Box } from '@mui/material';

// or only core styles
// import '@splidejs/react-splide/css/core';


const Carousel = (props) => {
    return (
        <>
        <Box 
            sx={{
                display: { xs: "none", sm: "none", md: "none", lg: "none", xl: 'flex' }
            }} 
            className="carousel-wrapper">
            <Splide
                options={{
                    rewind: true,
                    perPage: props.slideCount || 4,
                    perMove: 1,
                }}
                aria-label="My Favorite Images">
                {props.children.map(child => {
                    return <SplideSlide>
                        {child}
                    </SplideSlide>
                })}
            </Splide>
        </Box>
        <Box 
            sx={{
                display: { xs: "none", sm: "none", md: "none", lg: "flex", xl: 'none' }
            }} 
            className="carousel-wrapper">
            <Splide
                options={{
                    rewind: true,
                    perPage: props.slideCount || 5,
                    perMove: 1,
                }}
                aria-label="My Favorite Images">
                {props.children.map(child => {
                    return <SplideSlide>
                        {child}
                    </SplideSlide>
                })}
            </Splide>
        </Box>
        <Box 
            sx={{
                display: { xs: "none", sm: "flex", md: "flex", lg: "none", xl: 'none' }
            }} 
            className="carousel-wrapper">
            <Splide
                options={{
                    rewind: true,
                    perPage: 2,
                    perMove: 1,
                }}
                aria-label="My Favorite Images">
                {props.children.map(child => {
                    return <SplideSlide>
                        {child}
                    </SplideSlide>
                })}
            </Splide>
        </Box>
        <Box 
            sx={{
                display: { xs: "flex", sm: "none", md: "none", lg: "none", xl: 'none' }
            }} 
            className="carousel-wrapper">
            <Splide
                options={{
                    rewind: true,
                    perPage: 1,
                    perMove: 1,
                }}
                aria-label="My Favorite Images">
                {props.children.map(child => {
                    return <SplideSlide>
                        {child}
                    </SplideSlide>
                })}
            </Splide>
        </Box>
        </>
    )
}

export default Carousel;