/**
 * Returns the value of an element with a given ID.
 *
 * @param {string} fieldId The ID of the element.
 * @returns {string} The value of the element.
 */
export function getFieldValue(fieldId) {
  return document.getElementById(fieldId).value;
}

/**
 * Creates an event listener (which runs a provided function when the Enter key is pressed) and
 * returns a cleanup function (which removes the event listener when executed).
 *
 * @param {function} fn The function to execute when the Enter key is pressed.
 * @returns {function} The cleanup function, which should be run to remove the event listener.
 */
export function onEnterKey(fn) {
  function keydownFunction(event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      fn();
    }
  }
  document.addEventListener("keydown", keydownFunction);
  function cleanup() {
    document.removeEventListener("keydown", keydownFunction);
  }
  return cleanup;
}

/**
 * If a string is too long, reduces the string to the appropriate number of characters, followed
 * by "...". Otherwise, returns the string as-is.
 * @param {*} s
 * @param {*} characters
 * @returns
 */
export function cutOffString(s, characters) {
  if (s.length <= characters) {
    return s;
  }
  let ret = "";
  for (let i = 0; i < characters - 3; i++) {
    ret += s[i];
  }
  ret += "...";
  return ret;
}
