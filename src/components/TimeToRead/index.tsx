import React from "react";
import "./index.scss";

const TimeToRead = ({ words, minutes }: { words: number; minutes: number }) => (
  <div className="countdown">
    <span className="fa-layers fa-fw fa-1x">
      <span className="icon-clock" />
    </span>
    この記事は<b>{words}文字</b>で<b>約{minutes}分</b>で読めます
  </div>
);

export default TimeToRead;
