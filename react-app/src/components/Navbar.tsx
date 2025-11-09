import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/invoices", label: "Factures", Icon: ReceiptLongIcon },
  { path: "/customers", label: "Clients", Icon: PeopleIcon },
  { path: "/items", label: "Produits", Icon: Inventory2Icon },
  { path: "/addresses", label: "Adresses", Icon: LocationOnIcon },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            display: "flex",
            gap: 2,
            bgcolor: "#f1eafc",
            p: 1,
            borderRadius: 2,
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "-5px 5px 5px rgba(0,0,0,.5)",
          }}
        >
          {navItems.map(({ path, label, Icon }) => {
            const selected = isActive(path);
            return (
              <Button
                key={path}
                onClick={() => handleNavigation(path)}
                startIcon={<Icon />}
                disableRipple
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  px: 2.2,
                  py: 0.75,
                  minWidth: "auto",
                  gap: 1,
                  fontWeight: 500,
                  backgroundColor: selected ? "#e7ddff" : "transparent",
                  color: selected ? "#2b1a5a" : "#444",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: selected ? "#e7ddff" : "#efe8ff" },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;