import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
  title: "おおさまのみみはろばのみみ API",
})
@server("https://api.oosama-mimi-fortress.com", "本番環境")
namespace OosamaMimi;

/** 秘密の状態 */
model PitStatus {
  totalCount: uint32;
  lastShoutedAt: utcDateTime;
}

/** 秘密のデータ */
model ShoutRequest {
  @minLength(1)
  @maxLength(140)
  content: string;
}

/** RFC 7807 準拠のエラー構造 */
@error
model ProblemDetails {
  type: string;
  title: string;
  status: int32;
  detail: string;
  @header("x-trace-id") traceId: string;
}

@route("/secrets")
interface Secrets {
  /** データの状態を確認する */
  @get
  getStats(): PitStatus | ProblemDetails;

  /** 秘密をPOST */
  @post
  shout(@body body: ShoutRequest): {
    @statusCode statusCode: 201;
    @header contentType: "application/json";
    @body response: { id: string };
  } | ProblemDetails | ForbiddenError;

  /** 特定の秘密を削除 */
  @delete
  delete(@path id: string): {
    @statusCode statusCode: 200;
    @header contentType: "application/json";
    @body response: { message: "抹消完了" };
  } | ProblemDetails;
}

@error
model ForbiddenError extends ProblemDetails {
  @statusCode statusCode: 403;
}