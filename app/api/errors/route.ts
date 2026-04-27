import { NextResponse, type NextRequest } from "next/server";

type ErrorReport = {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

/**
 * POST /api/errors
 * Receives batched client error reports for structured logging.
 * This endpoint is intentionally unauthenticated so errors from anonymous users are captured.
 * Rate limiting and abuse prevention should be handled at the infrastructure level (CDN/WAF).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: ErrorReport[] = Array.isArray(body?.errors) ? body.errors : [];

    if (errors.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    // Cap to prevent abuse
    const batch = errors.slice(0, 10);

    for (const error of batch) {
      // Structured logging — pipe stdout to your log aggregator
      console.error(
        JSON.stringify({
          level: "error",
          source: "client",
          message: error.message ?? "Unknown error",
          stack: error.stack,
          url: error.url,
          userAgent: error.userAgent,
          timestamp: error.timestamp,
          context: error.context,
        })
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    // Never fail — this endpoint must be resilient
    return new NextResponse(null, { status: 204 });
  }
}
