import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopAppBar = () => {
  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes
          </Typography>
          <Button color="inherit" onClick={signout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
