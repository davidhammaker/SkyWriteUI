import Drawer from "@mui/material/Drawer";
import theme, { drawerWidth } from "./utils/theme";

const DrawerSliding = (props) => {
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: props.bgcolor,
          border: 0,
        },
      }}
      container={props.container}
      variant="temporary"
      open={props.open} // mobileOpen
      onClose={props.onClose} // toggleDrawer
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
    >
      {props.children}
    </Drawer>
  );
};

export default DrawerSliding;
