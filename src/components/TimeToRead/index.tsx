import React from "react";
import { Clock } from "lucide-react";
import * as style from "./index.module.scss";

const TimeToRead = ({ words, minutes }: { words: number; minutes: number }) => (
  <div className={style.countdown} data-testid="countdown">
    <Clock size={14} aria-hidden="true" style={{ verticalAlign: "-0.125em" }} />
    この記事は<b>{words}文字</b>で<b>約{minutes}分</b>で読めます
  </div>
);

export default TimeToRead;
