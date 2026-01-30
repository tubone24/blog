import { useState, useEffect, useCallback, useRef } from "react";
import type { SpeechStatus, UseSpeechSynthesisReturn } from "../types";

// Chrome 15秒問題への対策: テキストをチャンクに分割
const CHUNK_SIZE = 200;
const DEFAULT_RATE = 1.0;
const MIN_RATE = 0.5;
const MAX_RATE = 2.0;

/**
 * Web Speech API (SpeechSynthesis) を管理するカスタムフック
 */
export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [rate, setRateState] = useState<number>(DEFAULT_RATE);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentLangRef = useRef<string>("ja-JP");

  // ブラウザ対応チェック
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window;
    setIsSupported(supported);
    if (supported) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ページ遷移時のクリーンアップ
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // 言語に適した音声を選択
  const selectVoice = useCallback(
    (lang: string): SpeechSynthesisVoice | null => {
      if (!synthRef.current) return null;

      const voices = synthRef.current.getVoices();
      const langPrefix = lang.split("-")[0]; // 'ja-JP' -> 'ja'

      // 優先順位: 完全一致 > プレフィックス一致 > デフォルト
      return (
        voices.find((v) => v.lang === lang) ||
        voices.find((v) => v.lang.startsWith(langPrefix)) ||
        voices.find((v) => v.default) ||
        voices[0] ||
        null
      );
    },
    [],
  );

  // テキストを日本語/英語で判定
  const detectLanguage = useCallback((text: string): string => {
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
    return japaneseRegex.test(text) ? "ja-JP" : "en-US";
  }, []);

  // テキストをチャンクに分割（Chrome 15秒問題対策）
  const splitIntoChunks = useCallback((text: string): string[] => {
    const chunks: string[] = [];
    const sentences = text.split(/([。．.!?！？\n]+)/);

    let currentChunk = "";
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > CHUNK_SIZE && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    return chunks.length > 0 ? chunks : [text];
  }, []);

  // 次のチャンクを読み上げ
  const speakNextChunk = useCallback(() => {
    if (!synthRef.current) return;

    if (currentChunkIndexRef.current >= chunksRef.current.length) {
      setStatus("idle");
      currentChunkIndexRef.current = 0;
      return;
    }

    const chunk = chunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utteranceRef.current = utterance;

    utterance.rate = rate;
    utterance.lang = currentLangRef.current;

    const voice = selectVoice(currentLangRef.current);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      currentChunkIndexRef.current++;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") {
        setError(`読み上げエラー: ${event.error}`);
        setStatus("idle");
      }
    };

    synthRef.current.speak(utterance);
    setStatus("playing");
  }, [rate, selectVoice]);

  const speak = useCallback(
    (text: string, lang?: string) => {
      if (!synthRef.current || !isSupported) {
        setError("このブラウザは読み上げ機能に対応していません");
        return;
      }

      // 既存の読み上げをキャンセル
      synthRef.current.cancel();
      setError(null);

      const detectedLang = lang || detectLanguage(text);
      currentLangRef.current = detectedLang;
      chunksRef.current = splitIntoChunks(text);
      currentChunkIndexRef.current = 0;

      // 音声リストの読み込みを待つ
      setStatus("loading");

      const startSpeaking = () => {
        speakNextChunk();
      };

      if (synthRef.current.getVoices().length > 0) {
        startSpeaking();
      } else {
        synthRef.current.addEventListener("voiceschanged", startSpeaking, {
          once: true,
        });
      }
    },
    [isSupported, detectLanguage, splitIntoChunks, speakNextChunk],
  );

  const pause = useCallback(() => {
    if (synthRef.current && status === "playing") {
      synthRef.current.pause();
      setStatus("paused");
    }
  }, [status]);

  const resume = useCallback(() => {
    if (synthRef.current && status === "paused") {
      synthRef.current.resume();
      setStatus("playing");
    }
  }, [status]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      chunksRef.current = [];
      currentChunkIndexRef.current = 0;
      setStatus("idle");
    }
  }, []);

  const setRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(MIN_RATE, Math.min(MAX_RATE, newRate));
    setRateState(clampedRate);
  }, []);

  return {
    status,
    rate,
    isSupported,
    error,
    speak,
    pause,
    resume,
    stop,
    setRate,
  };
};
