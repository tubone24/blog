import React, { useCallback, useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import type { TextToSpeechProps } from "./types";
import * as style from "./index.module.scss";

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  lang = "auto",
  ariaLabel = "記事読み上げ",
}) => {
  const {
    status,
    rate,
    isSupported,
    error,
    speak,
    pause,
    resume,
    stop,
    setRate,
  } = useSpeechSynthesis();

  // SSR対応: クライアント側でのみisSupported を評価
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (status === "idle" || status === "loading") {
      speak(text, lang === "auto" ? undefined : `${lang}-JP`);
      ReactGA.event({
        category: "TextToSpeech",
        action: "Start",
      });
    } else if (status === "playing") {
      pause();
      ReactGA.event({
        category: "TextToSpeech",
        action: "Pause",
      });
    } else if (status === "paused") {
      resume();
      ReactGA.event({
        category: "TextToSpeech",
        action: "Resume",
      });
    }
  }, [status, text, lang, speak, pause, resume]);

  const handleStop = useCallback(() => {
    stop();
    ReactGA.event({
      category: "TextToSpeech",
      action: "Stop",
    });
  }, [stop]);

  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRate(parseFloat(e.target.value));
    },
    [setRate],
  );

  const getPlayPauseIcon = () => {
    switch (status) {
      case "loading":
        return "icon-spinner";
      case "playing":
        return "icon-pause";
      default:
        return "icon-play";
    }
  };

  const getPlayPauseLabel = () => {
    switch (status) {
      case "loading":
        return "読み込み中...";
      case "playing":
        return "一時停止";
      case "paused":
        return "再開";
      default:
        return "読み上げ開始";
    }
  };

  // SSRとブラウザ非対応時は何も表示しない
  if (!mounted || !isSupported) {
    return null;
  }

  return (
    <div
      className={style["text-to-speech"]}
      role="region"
      aria-label={ariaLabel}
      data-testid="text-to-speech"
    >
      <div className={style.controls}>
        <button
          type="button"
          className={style["play-button"]}
          onClick={handlePlayPause}
          disabled={status === "loading"}
          aria-label={getPlayPauseLabel()}
          data-testid="play-pause-button"
        >
          <span className={getPlayPauseIcon()} aria-hidden="true" />
        </button>

        {(status === "playing" || status === "paused") && (
          <button
            type="button"
            className={style["stop-button"]}
            onClick={handleStop}
            aria-label="停止"
            data-testid="stop-button"
          >
            <span className="icon-stop" aria-hidden="true" />
          </button>
        )}

        <div className={style["rate-control"]}>
          <label htmlFor="speech-rate" className={style["rate-label"]}>
            速度: {rate.toFixed(1)}x
          </label>
          <input
            id="speech-rate"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
            className={style["rate-slider"]}
            aria-label="読み上げ速度"
            data-testid="rate-slider"
          />
        </div>
      </div>

      {error && (
        <div className={style.error} role="alert" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
