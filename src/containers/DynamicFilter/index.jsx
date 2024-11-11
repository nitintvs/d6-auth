// import React, {useState} from 'react';

// import { 
//     Box, 
//     Checkbox, 
//     FormGroup,
//     FormControl,
//     FormControlLabel,
//     List,
//     ListItem,
//     ListItemText,
//     Slider
// } from '@mui/material';

// import SwipeableEdgeDrawer from 'components/SwipeableDrawer';



import React, { useState } from 'react';
import {
    Box,
    Collapse,
    FormControl,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import _ from 'lodash';
function rangetext(value) {
    return `$${value}`;
}

const ResponsiveBgBox = (props) => (
    <>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            {props.children}
        </Box>
        {/* <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
            <SwipeableEdgeDrawer>
                {props.children}
            </SwipeableEdgeDrawer>
        </Box> */}
    </>
)

// const DynamicFilter = ({ filterCategory }) => {
//     const [value, setValue] = useState([0, 1000]);

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     return (
//         <ResponsiveBgBox>
//         {filterCategory.map((filter, key) => (
//             <Box className="side-filter-wrapper">
//                 <FormControl className="filter-wrapper" sx={{ m: 3 }} component="fieldset" variant="standard">
//                     <span className="title">{filter.title}</span>
//                     {filter.type === 'checkbox' && <FormGroup>
//                         {filter.items.map((item, i) => (
//                             <FormControlLabel
//                                 className="description"
//                                 control={
//                                     <Checkbox
//                                         onClick={() => {
//                                             if (filter.selectedItem == item.name)
//                                                 filter.handleSelect()
//                                             else filter.handleSelect(item.name)
//                                         }}
//                                         checked={filter.selectedItem === item.name}
//                                         name={item.name} />
//                                 }
//                                 label={item.name}
//                             />
//                         ))}
//                         </FormGroup>}
//                     {filter.type === 'nested' && <List>
//                         {filter.items.map((item, i) => (
//                             <>
//                             {/* <ListItem>
//                                 <ListItemText
//                                     primary={item.name}
//                                     className="description"
//                                     onClick={() => {
//                                         if (filter.selectedItem === item.name)
//                                             filter.handleSelect()
//                                         else filter.handleSelect(item.name)
//                                     }}
//                                     // secondary={secondary ? 'Secondary text' : null}
//                                 />
//                             </ListItem> */}
//                             <FormControlLabel
//                                 className="description"
//                                 control={
//                                     <Checkbox
//                                         onClick={() => {
//                                             if (filter.selectedItem == item.name)
//                                                 filter.handleSelect()
//                                             else filter.handleSelect(item.name)
//                                         }}
//                                         checked={filter.selectedItem === item.name}
//                                         name={item.name} />
//                                 }
//                                 label={item.name}
//                             />
//                             {item.child.length > 0 && <FormGroup>
//                                 {item.child.map(child_item => (
//                                     <FormControlLabel
//                                         className="description"
//                                         control={
//                                             <Checkbox 
//                                                 onClick={() => {
//                                                     if (filter.selectedItem === child_item.name)
//                                                         filter.handleSelect()
//                                                     else filter.handleSelect(child_item.name)
//                                                 }}
//                                                 checked={filter.selectedItem === child_item.name}
//                                                 name={child_item.name} 
//                                             />
//                                         }
//                                         label={child_item.name}
//                                     />
//                                 ))}
//                             </FormGroup>}
//                             <br />
//                             {/* {item.child.length > 0 ? <br /> : '' } */}
//                             </>
//                         ))}
//                         </List>}
//                     {!filter.type && <List>
//                         {filter.items.map((item, i) => (
//                             <ListItem>
//                                 <ListItemText
//                                     primary={item.name}
//                                     className="description"
//                                     // secondary={secondary ? 'Secondary text' : null}
//                                 />
//                             </ListItem>
//                         ))}
//                         </List>}
//                     {filter.type === 'range' && <Slider
//                         getAriaLabel={() => 'Temperature range'}
//                         value={value}
//                         className="filter-range"
//                         onChange={handleChange}
//                         valueLabelDisplay="auto"
//                         getAriaValueText={rangetext}
//                     />}
//                 </FormControl>
//             </Box>
//         ))}
//         </ResponsiveBgBox>)
// }

// export default DynamicFilter;




const DynamicFilter = ({ filterCategory }) => {
    const [openItems, setOpenItems] = useState({});

    // Handle toggle of submenus
    const handleToggle = (itemName) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [itemName]: !prevState[itemName], // toggle the visibility of the submenu
        }));
    };

    console.log("filtertype",filterCategory)
    return (
        <ResponsiveBgBox>
        <Box
            sx={{
                p: 2,
                backgroundColor: '#f4f7fc',
                borderRadius: 1,
                maxWidth: '100%',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.09)',
            }}
        >
            {filterCategory.map((filter, key) => (
                <Box
                    key={key}
                    mb={1}
                    sx={{
                        borderBottom: '1px solid #e0e0e0',
                        pb: 1,
                    }}
                >
                    <FormControl component="fieldset" variant="standard" sx={{width:"100%"}}>
                        {/* Filter Title */}
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '0.8rem', md: '1rem' },
                                fontWeight: 600,
                                color: '#333',
                                mb: 0,
                            }}
                        >
                            {filter.title}
                        </Typography>

                        {/* Nested Filters with Expand/Collapse */}
                        {(filter.type === 'nested' || filter.type === 'checkbox') && (
                            <List >
                                {filter.items.map((item, i) => (
                                    <div key={i}>
                                        {/* Parent Item */}
                                        <ListItem
                                            button
                                            onClick={() => {
                                                filter.handleSelect(item.name); // Select parent item
                                                handleToggle(item.name);
                                            }}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor:
                                                    filter.selectedItem ===
                                                    item.name
                                                        ? '#d9f7f7'
                                                        : '#fff',
                                                borderRadius: 1,
                                                mb: 0.2,
                                                cursor: 'pointer',
                                                transition:
                                                    'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#f0f7ff',
                                                },
                                                p: { xs: '3px', md: '5px' },
                                            }}
                                        >
                                            <ListItemText
                                                primary={item.name}
                                                primaryTypographyProps={{
                                                    sx: {
                                                      fontSize: {
                                                        xs: '0.85rem', // Small screens
                                                        sm: '0.8rem',     // Medium screens
                                                        md: '0.9rem',   // Large screens
                                                        lg: '0.9rem',  // Extra large screens
                                                      },
                                                      fontWeight: 500,
                                                      color: '#555',
                                                    },
                                                  }}
                                            />
                                            <IconButton size="small">
                                                {openItems[item.name] ? (
                                                    <ExpandLessIcon />
                                                ) : (
                                                    <ExpandMoreIcon />
                                                )}
                                            </IconButton>
                                        </ListItem>

                                        {/* Submenu - Child items */}
                                        <Collapse
                                            in={openItems[item.name]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <List sx={{ pl: 0.5 }}>
                                                {item.child.length > 0 &&
                                                    item.child.map(
                                                        (child_item, idx) => (
                                                            <ListItem
                                                                key={idx}
                                                                button
                                                                onClick={() =>
                                                                    filter.handleSelect(
                                                                        child_item.name
                                                                    )
                                                                } // Select child item
                                                                sx={{
                                                                    backgroundColor:
                                                                        filter.selectedItem ===
                                                                        child_item.name
                                                                            ? '#e8f5e9'
                                                                            : '#fff',
                                                                    borderRadius: 1,
                                                                    mb: 0.2,
                                                                    cursor: 'pointer',
                                                                    transition:
                                                                        'background-color 0.3s ease',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            '#f0f7ff',
                                                                    },
                                                                    p: {
                                                                        xs: '2px',
                                                                        md: '5px',
                                                                    },
                                                                }}
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        child_item.name
                                                                    }
                                                                    primaryTypographyProps={{
                                                                        sx: {
                                                                          fontSize: {
                                                                            xs: '0.70rem', // Small screens
                                                                            sm: '0.75rem',     // Medium screens
                                                                            md: '0.8rem',   // Large screens
                                                                            lg: '0.8rem',  // Extra large screens
                                                                          },
                                                                          fontWeight: 400,
                                                                          color: '#666',
                                                                        },
                                                                      }}
                                                                />
                                                            </ListItem>
                                                        )
                                                    )}
                                            </List>
                                        </Collapse>
                                    </div>
                                ))}
                            </List>
                        )}

                        {/* Non-Nested Filters */}
                        {!filter.type && (
                            <List>
                                {filter.items.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        button
                                        onClick={() =>
                                            filter.handleSelect(item.name)
                                        } // Select non-nested item
                                        sx={{
                                            backgroundColor:
                                                filter.selectedItem ===
                                                item.name
                                                    ? '#d9f7f7'
                                                    : '#fff',
                                            borderRadius: 2,
                                            mb: 1,
                                            cursor: 'pointer',
                                            transition:
                                                'background-color 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: '#f0f7ff',
                                            },
                                            p: { xs: '8px', md: '12px' },
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.name}
                                            sx={{
                                                fontSize: {
                                                    xs: '1rem',
                                                    md: '1.1rem',
                                                },
                                                fontWeight: 500,
                                                color: '#555',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </FormControl>
                </Box>
            ))}
        </Box>
        </ResponsiveBgBox>
    );
};

export default DynamicFilter;
