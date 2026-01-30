import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import TextToSpeech from "./index";

// ReactGA モック
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

// SpeechSynthesis APIのモック
const mockSpeak = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockCancel = jest.fn();
const mockGetVoices = jest.fn(() => [
  { lang: "ja-JP", name: "Japanese Voice", default: true },
  { lang: "en-US", name: "English Voice", default: false },
]);

const mockSpeechSynthesis = {
  speak: mockSpeak,
  pause: mockPause,
  resume: mockResume,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  speaking: false,
  paused: false,
  pending: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// SpeechSynthesisUtterance モック
class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = "";
  rate: number = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe("TextToSpeech", () => {
  beforeAll(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    });

    (
      global as unknown as {
        SpeechSynthesisUtterance: typeof MockSpeechSynthesisUtterance;
      }
    ).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete (window as unknown as { speechSynthesis?: SpeechSynthesis })
      .speechSynthesis;
    delete (
      global as unknown as {
        SpeechSynthesisUtterance?: typeof MockSpeechSynthesisUtterance;
      }
    ).SpeechSynthesisUtterance;
  });

  describe("レンダリング", () => {
    it("コンポーネントが正しくレンダリングされる", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        expect(screen.getByTestId("text-to-speech")).toBeInTheDocument();
      });
      expect(screen.getByTestId("play-pause-button")).toBeInTheDocument();
      expect(screen.getByTestId("rate-slider")).toBeInTheDocument();
    });

    it("適切なaria属性を持つ", async () => {
      render(<TextToSpeech text="テスト文章" ariaLabel="カスタムラベル" />);

      await waitFor(() => {
        expect(screen.getByRole("region")).toHaveAttribute(
          "aria-label",
          "カスタムラベル",
        );
      });
    });
  });

  describe("再生コントロール", () => {
    it("再生ボタンクリックでspeakが呼ばれる", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        expect(screen.getByTestId("play-pause-button")).toBeInTheDocument();
      });

      const playButton = screen.getByTestId("play-pause-button");
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(mockSpeak).toHaveBeenCalled();
      });
    });
  });

  describe("速度調整", () => {
    it("スライダーで速度を変更できる", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        expect(screen.getByTestId("rate-slider")).toBeInTheDocument();
      });

      const slider = screen.getByTestId("rate-slider");
      fireEvent.change(slider, { target: { value: "1.5" } });

      expect(screen.getByText("速度: 1.5x")).toBeInTheDocument();
    });

    it("速度のデフォルト値が1.0xである", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        expect(screen.getByText("速度: 1.0x")).toBeInTheDocument();
      });
    });
  });

  describe("アクセシビリティ", () => {
    it("基本的なアクセシビリティ問題がない", async () => {
      const { container } = render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        expect(screen.getByTestId("text-to-speech")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("再生ボタンに適切なaria-labelがある", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        const playButton = screen.getByTestId("play-pause-button");
        expect(playButton).toHaveAttribute("aria-label", "読み上げ開始");
      });
    });

    it("速度スライダーに適切なaria-labelがある", async () => {
      render(<TextToSpeech text="テスト文章" />);

      await waitFor(() => {
        const slider = screen.getByTestId("rate-slider");
        expect(slider).toHaveAttribute("aria-label", "読み上げ速度");
      });
    });
  });
});

describe("TextToSpeech - ブラウザ非対応時", () => {
  beforeAll(() => {
    delete (window as unknown as { speechSynthesis?: SpeechSynthesis })
      .speechSynthesis;
  });

  afterAll(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    });
  });

  it("ブラウザ非対応時は何も表示しない", () => {
    const { container } = render(<TextToSpeech text="テスト文章" />);
    expect(container).toBeEmptyDOMElement();
  });
});
