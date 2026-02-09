import { z } from "zod";

const FORBIDDEN_WORDS = ["王様", "ロバ", "king", "donkey"] as const;

export const SecretSchema = z
  .string()
  .min(1, { message: "秘密を吐きなさい。" })
  .max(140, { message: "穴が溢れます（140文字以内）。" })
  .refine(
    (val) => {
      // 全角・半角・大文字・小文字を無視してチェック
      const normalized = val.normalize("NFKC").toLowerCase();
      return !FORBIDDEN_WORDS.some((word) => normalized.includes(word));
    },
    { message: "禁忌の言葉が含まれています。処刑されますよ？" },
  );

export type Secret = z.infer<typeof SecretSchema>;
