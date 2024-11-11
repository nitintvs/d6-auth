import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  List,
  ListItem,
  ListItemText,
  Button,
  Collapse,
  FormGroup,
} from "@mui/material";
import SwipeableEdgeDrawer from "components/SwipeableDrawer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";
import TuneIcon from "@mui/icons-material/Tune";
import IconButton from "@mui/material/IconButton";
const ResponsiveBgBox = (props) => (
  <>
    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
      {props.children}
    </Box>
    {/* <Box sx={{ display: { xs: "block", sm: "block", md: "" } }}>
      <SwipeableEdgeDrawer>{props.children}</SwipeableEdgeDrawer>
    </Box> */}
  </>
);

const FilterDropdown = ({ filterCategory, type }) => {
  const [value, setValue] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter visibility

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen); // Toggle the visibility state
  };

  return (
    <ResponsiveBgBox>
      <Button
        size="small"
        variant="outlined"
        onClick={toggleFilter}
        sx={{
          p: { xs: 0.6 },
          ml: { xs: "1.2rem" },
          mt: "5px",
          fontSize: "0.8rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        filter
        <TuneIcon sx={{ fontSize: "0.8rem", ml: 1 }} />
      </Button>
      <Collapse
        sx={{
          width: { xs: "200px" },
          "& .MuiCollapse-wrapperInner": {
            width: "110%",
          },
        }}
        in={isFilterOpen}
      >
        {filterCategory.map((filter, key) => (
          <Box
            textAlign={"left"}
            className="side-filter-wrapper"
            key={key}
            sx={{
              ml: 2.5,
              fontSize: "0.2rem",
              p: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <FormControl
              className="filter-wrapper"
              sx={{ m: 0 }}
              component="fieldset"
              variant="standard"
            >
              {filter.type === "checkbox" && (
                <FormGroup>
                  {filter.items.map((item, i) => (
                    <FormControlLabel
                      key={i}
                      className="description"
                      control={
                        <Checkbox
                          onClick={() => {
                            if (filter.selectedItem === item.name)
                              filter.handleSelect();
                            else filter.handleSelect(item.name);
                          }}
                          checked={filter.selectedItem === item.name}
                          name={item.name}
                        />
                      }
                      label={item.name}
                      sx={{
                        // mb: 1,

                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.7rem",
                          color: "#000",
                          whiteSpace: "nowrap", // Prevents text wrapping
                          //   overflow: "hidden", // Hides overflowed text
                          //   textOverflow: "ellipsis", // Adds ellipsis for overflowed text
                        },
                      }}
                    />
                  ))}
                </FormGroup>
              )}
              {filter.type === "nested" && (
                <List sx={{ pl: 0 }}>
                  {filter.items.map((item, i) => (
                    <React.Fragment key={i}>
                      <FormControlLabel
                        className="description"
                        control={
                          <Checkbox
                            onClick={() => {
                              if (filter.selectedItem === item.name)
                                filter.handleSelect();
                              else filter.handleSelect(item.name);
                            }}
                            checked={filter.selectedItem === item.name}
                            name={item.name}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label={item.name}
                        sx={{
                          // mb: 1,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            color: "#000",
                            whiteSpace: "nowrap", // Prevents text wrapping
                            // overflow: "hidden", // Hides overflowed text
                            // textOverflow: "ellipsis", // Adds ellipsis for overflowed text
                          },
                        }}
                      />
                      {item.child.length > 0 && (
                        <FormGroup sx={{ pl: 0 }}>
                          {item.child.map((child_item, j) => (
                            <FormControlLabel
                              key={j}
                              className="description"
                              control={
                                <Checkbox
                                  onClick={() => {
                                    if (filter.selectedItem === child_item.name)
                                      filter.handleSelect();
                                    else filter.handleSelect(child_item.name);
                                  }}
                                  checked={
                                    filter.selectedItem === child_item.name
                                  }
                                  name={child_item.name}
                                  sx={{ p: 0.5 }}
                                />
                              }
                              label={child_item.name}
                              sx={{
                                // mb: 1,
                                "& .MuiFormControlLabel-label": {
                                  fontWeight: "500",
                                  color: "#848484",
                                  fontSize: "0.7rem",
                                  whiteSpace: "nowrap", // Prevents text wrapping
                                  //   overflow: "hidden", // Hides overflowed text
                                  //   textOverflow: "ellipsis", // Adds ellipsis for overflowed text
                                },
                              }}
                            />
                          ))}
                        </FormGroup>
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                </List>
              )}
              {!filter.type && (
                <List sx={{ pl: 0 }}>
                  {filter.items.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={item.name}
                        className="description"
                        sx={{ typography: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              {filter.type === "range" && (
                <Slider
                  getAriaLabel={() => "Range"}
                  value={value}
                  className="filter-range"
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={() => `${value[0]} - ${value[1]}`}
                  sx={{ m: 1, mt: 0 }}
                />
              )}
            </FormControl>
          </Box>
        ))}
      </Collapse>
    </ResponsiveBgBox>
  );
};

export default FilterDropdown;
