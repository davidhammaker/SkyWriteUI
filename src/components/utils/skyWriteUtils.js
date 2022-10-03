import { defaultFilename, defaultEditorValue } from "../../settings";

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
