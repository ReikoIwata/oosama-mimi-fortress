import { Hono } from "hono";
import { z } from "zod";
import { ulid } from "ulid";
import { SecretSchema } from "./domain/secret";

const app = new Hono();

// POST: おおさまのみみはろばの耳 (Shout) ---
app.post("/secrets", async (c) => {
  const body = await c.req.json();

  // Zodによる「禁忌ワード」と「文字数」の厳格なバリデーション
  const result = SecretSchema.safeParse(body.content);

  if (!result.success) {
    return c.json(
      {
        type: "https://errors.oosama-mimi.com/forbidden-word",
        title: "Forbidden Content",
        status: 403,
        detail: result.error.issues[0].message,
        traceId: ulid(), // RFC 7807 準拠
      },
      403,
    );
  }

  // 本来はここでDBに保存。今はULIDを発行するだけ。
  const id = ulid();
  return c.json({ id }, 201);
});

// GET: 秘密の状態確認だけ (Stats)
app.get("/secrets", (c) => {
  // 秘密の中身は返さない。メタデータのみ。
  return c.json({
    totalCount: 33, // モック値
    lastShoutedAt: new Date().toISOString(),
  });
});

// DELETE
app.delete("/secrets/:id", (c) => {
  const id = c.req.param("id");
  // 抹消完了のメッセージのみ
  return c.json({ message: "抹消完了", targetId: id });
});

export default app;
