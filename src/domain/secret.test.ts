import { describe, it, expect } from "vitest";
import { SecretSchema } from "./secret";

describe("SecretSchema (王様の耳はロバの耳バリデーション)", () => {
  describe("正常系: ささやきが許可されるケース", () => {
    it("1文字のささやきを許可する", () => {
      const input = "あ";
      expect(SecretSchema.parse(input)).toBe(input);
    });

    it("140文字ぴったりのささやきを許可する", () => {
      const input = "あ".repeat(140);
      expect(SecretSchema.parse(input)).toBe(input);
    });

    it("禁忌に触れない一般的な悪口を許可する", () => {
      const input = "あなたの耳はとても立派ですね";
      expect(SecretSchema.parse(input)).toBe(input);
    });
  });

  describe("異常系: 境界値・文字数エラー", () => {
    it("空文字（0文字）を拒絶する", () => {
      const result = SecretSchema.safeParse("");
      expect(result.success).toBe(false);
    });

    it("141文字以上を拒絶する", () => {
      const input = "あ".repeat(141);
      const result = SecretSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("140文字以内");
      }
    });
  });

  describe("異常系: 禁忌ワード（検閲機能）", () => {
    const cases = ["王様", "ロバ", "KING", "Donkey", "王様はロバ", "kInG"];

    it.each(cases)('禁忌ワード "%s" が含まれる場合は拒絶する', (word) => {
      const result = SecretSchema.safeParse(`これは${word}の秘密です`);
      expect(result.success).toBe(false);
    });

    it("全角の「ＫＩＮＧ」のような揺らぎも検知して拒絶する", () => {
      const result = SecretSchema.safeParse("あいつはＫＩＮＧだ");
      expect(result.success).toBe(false);
    });
  });
});
