/**
 * 読み上げの状態
 */
export type SpeechStatus = "idle" | "playing" | "paused" | "loading";

/**
 * TextToSpeechコンポーネントのProps
 */
export interface TextToSpeechProps {
  /** 読み上げるテキスト */
  text: string;
  /** 記事の言語 (自動判定のヒント) */
  lang?: "ja" | "en" | "auto";
  /** コンポーネントのラベル (アクセシビリティ用) */
  ariaLabel?: string;
}

/**
 * useSpeechSynthesisフックの戻り値
 */
export interface UseSpeechSynthesisReturn {
  /** 現在の状態 */
  status: SpeechStatus;
  /** 読み上げ速度 */
  rate: number;
  /** ブラウザ対応状況 */
  isSupported: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 読み上げ開始 */
  speak: (text: string, lang?: string) => void;
  /** 一時停止 */
  pause: () => void;
  /** 再開 */
  resume: () => void;
  /** 停止 */
  stop: () => void;
  /** 速度設定 */
  setRate: (rate: number) => void;
}
