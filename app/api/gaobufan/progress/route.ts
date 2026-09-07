import { NextRequest, NextResponse } from 'next/server';

/**
 * Bufan 英语工具的云端存档 —— 跨设备同步的第二条通道。
 * (第一条是仓库里的 public/gaobufan/progress.json,不需要任何配置)
 *
 * 存在 Redis 里(Vercel KV / Upstash 都是同一套 REST 接口),没配就明确回
 * configured:false / 501,页面会安静地退回只用进度档,不会报错也不会丢进度。
 *
 * 要打开云端同步:
 *   1. Vercel 项目 → Storage → 建一个 KV(Upstash Redis),连到这个项目;
 *      它会自动注入 KV_REST_API_URL / KV_REST_API_TOKEN。
 *   2. (建议)再加一个环境变量 GAOBUFAN_SYNC_PIN,填页面开场那四位数字。
 *      不填的话,任何知道这个地址的人都能读写这份存档。
 *
 * 存的只是单词熟练度,没有任何个人或业务信息;四位数字也算不上强口令,
 * 它防的是「谁顺手把小孩的进度改了」,别当成真正的安全边界。
 */

export const dynamic = 'force-dynamic';

const PROFILES = ['bufan'];              // 访客存档从不上云
const MAX_BYTES = 2_000_000;             // 3000 词的存档大概几百 KB,留一倍余量
const HISTORY = 10;                      // 保留最近 10 次,万一哪台设备推上来一份坏的还能回滚

type Kv = { url: string; token: string };

function kv(): Kv | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

/** Upstash 的 pipeline 接口:一个数组里放多条命令,回来一个同长度的结果数组 */
async function redis(conn: Kv, commands: (string | number)[][]) {
  const res = await fetch(`${conn.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${conn.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return (await res.json()) as { result?: unknown; error?: string }[];
}

function key(profile: string) {
  return `gaobufan:save:${profile}`;
}

/** 没设 GAOBUFAN_SYNC_PIN 就不校验 —— KV 是自己配的,等于自己开的门 */
function authed(request: NextRequest) {
  const want = process.env.GAOBUFAN_SYNC_PIN;
  if (!want) return true;
  return request.headers.get('x-eq-pin') === want;
}

function profileOf(value: unknown): string | null {
  return typeof value === 'string' && PROFILES.includes(value) ? value : null;
}

type Save = { v: number; updatedAt?: number; [k: string]: unknown };

function parseSave(raw: unknown): Save | null {
  if (typeof raw !== 'string') return null;
  try {
    const d = JSON.parse(raw);
    return d && d.v === 1 ? (d as Save) : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const profile = profileOf(request.nextUrl.searchParams.get('profile'));
  if (!profile) return NextResponse.json({ ok: false, error: 'bad profile' }, { status: 400 });

  const conn = kv();
  if (!conn) return NextResponse.json({ ok: true, configured: false });
  if (!authed(request)) return NextResponse.json({ ok: false, error: 'pin' }, { status: 403 });

  try {
    const [got] = await redis(conn, [['GET', key(profile)]]);
    return NextResponse.json({ ok: true, configured: true, save: parseSave(got?.result) });
  } catch {
    return NextResponse.json({ ok: false, error: 'kv' }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  const conn = kv();
  if (!conn) return NextResponse.json({ ok: false, configured: false }, { status: 501 });
  if (!authed(request)) return NextResponse.json({ ok: false, error: 'pin' }, { status: 403 });

  const body = await request.text();
  if (body.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'too large' }, { status: 413 });
  }

  let payload: { profile?: unknown; save?: Save };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const profile = profileOf(payload.profile);
  const save = payload.save;
  if (!profile || !save || save.v !== 1) {
    return NextResponse.json({ ok: false, error: 'bad save' }, { status: 400 });
  }

  const stamp = typeof save.updatedAt === 'number' ? save.updatedAt : 0;

  try {
    const [got] = await redis(conn, [['GET', key(profile)]]);
    const stored = parseSave(got?.result);
    // 云端比来的这份新 = 另一台设备刚存过。不覆盖,把云端那份回给它,
    // 让页面合并完再推一次(合并规则见 english.html 里的 Sync.merge)。
    if (stored && (stored.updatedAt || 0) > stamp) {
      return NextResponse.json({ ok: false, conflict: true, save: stored }, { status: 409 });
    }

    const text = JSON.stringify(save);
    await redis(conn, [
      ['SET', key(profile), text],
      ['LPUSH', `${key(profile)}:history`, text],
      ['LTRIM', `${key(profile)}:history`, 0, HISTORY - 1],
    ]);
    return NextResponse.json({ ok: true, configured: true, updatedAt: stamp });
  } catch {
    return NextResponse.json({ ok: false, error: 'kv' }, { status: 502 });
  }
}
