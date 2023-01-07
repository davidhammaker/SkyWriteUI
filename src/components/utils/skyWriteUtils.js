import Cookies from "js-cookie";
import axios from "axios";
import { defaultFilename, defaultEditorValue } from "../../settings";
import { backendOrigin } from "./navTools";

/**
 * Modify the app state to trigger events that clear the editor and prepare a new file.
 *
 * @param {*} appState - The global `appState` object (defined in `App`)
 */
export const setUpNewFile = (appState) => {
  appState.setEditorValue(defaultEditorValue);
  appState.setFileId(null);
  appState.setFilename(defaultFilename);
  appState.setFilePath([]);
};

/**
 * Delete a storage object with a given ID.
 *
 * @param {int} objId - The ID of the object to be deleted.
 * @param {bool} recursive - If 'true', set '?recursive' param, deleting folder contents with folder.
 */
export const deleteObj = (objId, recursive) => {
  axios
    .delete(
      `${backendOrigin}/storage_objects/${objId}/${
        recursive ? "?recursive" : ""
      }`,
      {
        headers: {
          Authorization: `token ${Cookies.get("token")}`,
        },
      }
    )
    .then((response) => {})
    .catch((error) => {});
};
