import React from "react";

import LandingLayout from "./LandingLayout";
import CustomTheme from "./theme";

const Layout = (props) =>
    <CustomTheme>
        <LandingLayout {...props} />
    </CustomTheme>;

export default Layout;
