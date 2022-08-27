import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import theme from "./utils/theme";

const CustomFormButton = styled(Button)({
  backgroundColor: theme.primaryDark,
  "&:hover": { backgroundColor: theme.primaryDarkest },
});

export default CustomFormButton;
