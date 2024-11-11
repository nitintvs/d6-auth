import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs({ itemList, selectedItem, type }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: 'background.paper', 
                    // display: 'flex', 
                    height: { md: 450, lg: 550 },
                    display: { xs: 'none', sm: 'none', md: 'flex' } }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    className='thumbnail-container'
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >   
                    {itemList.map((item, i) => 
                        <Tab 
                            {...a11yProps(i)} 
                            className="thumbnail"
                            icon={<img src={item.image} key={i} />}
                        />
                    )}
                </Tabs>
                <div className='image-container'>
                    {itemList.map((item, i) => 
                        <TabPanel value={value} index={i}>
                            {type === 'image' && <img src={item.image} key={i} />}
                        </TabPanel>
                    )}
                </div>
            </Box>
            <Box sx={{ display: { sm: 'block', md: 'none' } }}>
                <div className='block-image-container'>
                    {itemList.map((item, i) => 
                        <TabPanel value={value} index={i}>
                            {type === 'image' && <img src={item.image} key={i} />}
                        </TabPanel>
                    )}
                </div>
                <Tabs
                    orientation="horizontal"
                    variant="scrollable"
                    className='block-thumbnail-container'
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >   
                    {itemList.map((item, i) => 
                        <Tab 
                            {...a11yProps(i)} 
                            className="thumbnail"
                            icon={<img src={item.image} key={i} />}
                        />
                    )}
                </Tabs>
            </Box>
        </>
    );
}