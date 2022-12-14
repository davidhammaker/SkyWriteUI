import { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import axios from "axios";
import { backendOrigin } from "./utils/navTools";

const SelectDefaultStorage = (props) => {
  const appState = props.appState;

  const [storageOptions, setStorageOptions] = useState({});
  const [finalOptions, setFinalOptions] = useState({});

  useEffect(() => {
    axios
      .get(`${backendOrigin}/storage_options/`, {
        headers: { Authorization: `token ${Cookies.get("token")}` },
      })
      .then(function (response) {
        setStorageOptions(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  }, []);

  useEffect(() => {
    let newOptions = {};
    Object.keys(storageOptions).forEach((storageOption) => {
      if (storageOptions[storageOption] !== null && storageOption !== null) {
        newOptions[storageOption] = storageOptions[storageOption];
      }
    });
    setFinalOptions(newOptions);
  }, [storageOptions]);

  const handleSelectStorage = (event) => {
    axios
      .patch(
        `${backendOrigin}/config/`,
        {
          default_storage: event.target.value,
        },
        {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        }
      )
      .then(() => {
        props.setConfig({
          ...props.config,
          default_storage: event.target.value,
        });
        appState.setNeedStorage(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography fontSize="small">Default Storage</Typography>
      </Grid>
      <Grid item>
        {storageOptions && (
          <Select
            value={
              props.config.default_storage === "" ||
              props.config.default_storage === null
                ? "placeholderValue"
                : props.config.default_storage
            }
            onChange={handleSelectStorage}
          >
            {(props.config.default_storage === "" ||
              props.config.default_storage === null) && (
              <MenuItem value="placeholderValue">
                (Select Default Storage)
              </MenuItem>
            )}
            {storageOptions &&
              Object.keys(finalOptions).map((storageOptionKey) => (
                <MenuItem
                  key={storageOptions[storageOptionKey]}
                  value={storageOptions[storageOptionKey]}
                >
                  {storageOptionKey}
                </MenuItem>
              ))}
          </Select>
        )}
      </Grid>
    </Grid>
  );
};

export default SelectDefaultStorage;
