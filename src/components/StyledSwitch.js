import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import theme from "./utils/theme";

const StyledSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.secondary,
    "&:hover": {
      backgroundColor: `${theme.secondaryLight}44`,
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.secondary,
  },
}));

export default StyledSwitch;
