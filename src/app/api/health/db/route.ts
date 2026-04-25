import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TIMEOUT_MS = 3000;

export async function GET() {
  const start = Date.now();
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1 AS ok`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)
      ),
    ]);
    return NextResponse.json({
      status: "ok",
      latencyMs: Date.now() - start,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // Azure SQL Serverless is paused/resuming → return 503 so the client
    // can show the "waking up" banner and poll.
    const isWaking =
      msg.includes("P1001") ||
      msg.includes("timeout") ||
      msg.includes("ETIMEDOUT") ||
      msg.includes("ECONNREFUSED");
    return NextResponse.json(
      {
        status: isWaking ? "waking" : "error",
        message: msg,
      },
      { status: isWaking ? 503 : 500 }
    );
  }
}
