import React, { useEffect, useState } from "react";
import {
  generateKey,
  encryptDataToBytes,
  decryptDataFromBytes,
} from "./utils/encryption";
import axios from "axios";

/**
 * An example React component.
 */
const Practice = () => {
  const [textData, setTextData] = useState("");
  const [ciphertext, setCiphertext] = useState(null);
  const [iv, setIv] = useState(null);
  const [key, setKey] = useState(null);
  const [saveIt, setSaveIt] = useState(false);
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  useEffect(() => {
    generateKey().then((newKey) => setKey(newKey));
  }, []);

  useEffect(() => {
    if (saveIt) {
      console.log("SAVING");
      setEncryptedText(ciphertext);
      axios
        .post("http://localhost:5000/", { data: ciphertext, iv: iv })
        .then((resp) => console.log(resp));
      setSaveIt(false);
    } else {
      console.log(
        "Updating ciphertext",
        new Uint8Array(ciphertext, 0, 5).toString()
      );
    }
  }, [ciphertext]);

  return (
    <div>
      <textarea
        id="my-text-area"
        defaultValue={textData}
        onChange={(event) => setTextData(event.target.value)}
      ></textarea>
      <button
        onClick={(event) => {
          event.preventDefault();
          console.log(textData);
        }}
      >
        Console.Log
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          encryptDataToBytes(textData, key).then((ret) => {
            setIv(ret.iv);
            setCiphertext(ret.ciphertext);
          });
        }}
      >
        Encrypt / Perform Effects
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          encryptDataToBytes(textData, key).then((ret) => {
            setSaveIt(true);
            setIv(ret.iv);
            setCiphertext(ret.ciphertext);
          });
        }}
      >
        Pretend to Save
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();

          decryptDataFromBytes(key, iv, ciphertext).then((ret) => {
            setDecryptedText(ret);
          });
        }}
      >
        Decrypt
      </button>
      <div>
        <em style={{ marginRight: "10px" }}>Encrypted as:</em>
        {encryptedText}
      </div>
      <div>{decryptedText}</div>
    </div>
  );
};

export default Practice;
