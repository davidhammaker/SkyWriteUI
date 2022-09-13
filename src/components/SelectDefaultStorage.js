import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import axios from "axios";
import { backendOrigin } from "./utils/navTools";

const SelectDefaultStorage = (props) => {
  const [storageOptions, setStorageOptions] = useState(null);

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
    console.log(storageOptions);
    if (storageOptions) {
      Object.keys(storageOptions).map((storageOptionKey) => {
        console.log(storageOptions[storageOptionKey], storageOptionKey);
      });
    }
  }, [storageOptions]);

  return (
    <FormControl sx={{ minWidth: 160 }}>
      <InputLabel id="default-storage-label">Default Storage</InputLabel>
      <Select labelId="default-storage-label" label="Default Storage">
        {storageOptions &&
          Object.keys(storageOptions).map((storageOptionKey) => (
            <MenuItem
              key={storageOptions[storageOptionKey]}
              value={storageOptions[storageOptionKey]}
            >
              {storageOptionKey}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectDefaultStorage;
