import React, { useState } from 'react'

import { 
    Divider,
    Grid,
} from '@mui/material';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";

const FAQs = ({ breadcrumbs }) => {

    return (
        <CustomLayout>
            <div class="parallax">
                <div className="header-wrapper">
                    <span className="span-2">FAQs</span>
                </div>
            </div>
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={"FAQs"} />
                <Divider className="divider"/>
                <Grid container className="contact-wrapper main-content-wrapper">
                    <Grid item xs={12} sm={12} md={10} lg={8}>
                        <span className='content-wrapper description'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </span>

                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    )
}

export default FAQs