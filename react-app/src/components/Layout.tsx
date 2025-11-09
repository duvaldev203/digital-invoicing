import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import "../App.css";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="panel">
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          mt: 2,
          pb: 4,
          minHeight: "calc(100vh - 96px)",
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mx: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default Layout;