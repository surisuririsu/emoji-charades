"use client";
import { useState } from "react";
import Emoji from "@/components/Emoji";
import { emojiCodePoints, emojiStrategy } from "@/utils/emojis";
import { socket } from "@/utils/socket";
import styles from "./EmojiPicker.module.scss";

const MAX_RESULTS = 95;

export default function EmojiPicker() {
  const [query, setQuery] = useState("");

  function onChange(e) {
    setQuery(e.target.value);
  }

  function onClickEmoji(cp) {
    socket.emit("appendHint", { emoji: cp });
  }

  let results1 = [];
  let results2 = [];
  let results3 = [];

  Object.keys(emojiStrategy).forEach((key) => {
    const { shortname_alternates, keywords, shortname, unicode_output } =
      emojiStrategy[key];
    const snakeQuery = query.replaceAll(" ", "_");
    if (shortname.indexOf(snakeQuery) > -1) {
      if (emojiCodePoints.indexOf(unicode_output) > -1)
        results1.push(unicode_output);
      else if (emojiCodePoints.indexOf(key) > -1) results1.push(key);
      return;
    }
    if (shortname_alternates && shortname_alternates.indexOf(snakeQuery) > -1) {
      if (emojiCodePoints.indexOf(unicode_output) > -1)
        results2.push(unicode_output);
      else if (emojiCodePoints.indexOf(key) > -1) results2.push(key);
      return;
    }
    if (keywords && keywords.indexOf(query) > -1) {
      if (emojiCodePoints.indexOf(unicode_output) > -1)
        results3.push(unicode_output);
      else if (emojiCodePoints.indexOf(key) > -1) results3.push(key);
      return;
    }
  });

  const combinedResults = results1
    .concat(results2)
    .concat(results3)
    .filter((r) => emojiCodePoints.indexOf(r) > -1)
    .slice(0, MAX_RESULTS);

  return (
    <div className={styles.emojiPicker}>
      <input
        onChange={onChange}
        placeholder="Search for an emoji..."
        autoFocus
      />
      <div className={styles.results}>
        {combinedResults.map((cp) => (
          <div key={cp} onClick={() => onClickEmoji(cp)}>
            <Emoji codePoint={cp} />
          </div>
        ))}
      </div>
    </div>
  );
}
