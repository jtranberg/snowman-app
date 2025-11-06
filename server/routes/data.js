// server/routes/data.js
import express from 'express';
import SensorReading from '../models/SensorReading.js';
import RuntimeStat from '../models/RuntimeStat.js';

const router = express.Router();

let dataRequested = false; // single-instance handshake flag

// ===== Debug: log every hit =====
router.use((req, _res, next) => {
  console.log(
    '➡️', req.method, req.originalUrl,
    '| CT=', req.headers['content-type'] || 'n/a',
    '| UA=', req.headers['user-agent'] || 'n/a',
    '| IP=', req.ip
  );
  next();
});

// --- helpers ---
const toNum = (v) => {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Accept only plausible ~12 V rail values; ignore junk
const toVolt = (v) => {
  const n = toNum(v);
  return (n !== undefined && n >= 8 && n <= 16) ? n : undefined;
};

// Accept realistic CO₂ ppm (0..10000)
const toCO2 = (v) => {
  const n = toNum(v);
  return (n !== undefined && n >= 0 && n <= 10000) ? n : undefined;
};

// Accept °C in a reasonable indoor range (-20..80)
const toDegC = (v) => {
  const n = toNum(v);
  return (n !== undefined && n >= -20 && n <= 80) ? n : undefined;
};

// Accept RH% (0..100)
const toRH = (v) => {
  const n = toNum(v);
  return (n !== undefined && n >= 0 && n <= 100) ? n : undefined;
};

// helper: clamp/format ms -> HH:MM:SS
function msToHms(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// If body arrived as a raw string (e.g. text/plain), try to JSON.parse it.
router.use((req, _res, next) => {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      // leave as string; handlers will cope
    }
  }
  next();
});

// ✅ POST /api/data/request-data — called by frontend to request a reading
router.post('/request-data', (_req, res) => {
  console.log('📡 Frontend called /request-data');
  dataRequested = true;
  res.json({ success: true, message: 'ESP32 will send data next cycle.' });
});

// ✅ GET /api/data/data-requested — polled by ESP32
router.get('/data-requested', (_req, res) => {
  console.log('📡 ESP32 polled /data-requested | Flag is:', dataRequested);
  if (dataRequested) {
    dataRequested = false;
    console.log('✅ Flag consumed. Returning "true" to ESP32');
    return res.send('true');
  }
  console.log('⏳ Flag is false. Returning "false"');
  res.send('false');
});

// ✅ POST /api/data — ESP32 sends reading (now accepts runtime + CO2/env fields)
router.post('/', async (req, res) => {
  try {
    console.log('🧪 Incoming req.body:', req.body);
    console.log('📥 RAW BODY KEYS:', Object.keys(req.body || {}));

    // Accept both naming schemes for temps (alpha..echo) or (intake..cellC)
    const alpha   = toNum(req.body.alpha   !== undefined && req.body.alpha   !== null ? req.body.alpha   : req.body.intake);
    const bravo   = toNum(req.body.bravo   !== undefined && req.body.bravo   !== null ? req.body.bravo   : req.body.postCryo);
    const charlie = toNum(req.body.charlie !== undefined && req.body.charlie !== null ? req.body.charlie : req.body.cellA);
    const delta   = toNum(req.body.delta   !== undefined && req.body.delta   !== null ? req.body.delta   : req.body.cellB);
    const echo    = toNum(req.body.echo    !== undefined && req.body.echo    !== null ? req.body.echo    : req.body.cellC);

    // Only store plausible 12V-ish values (else null)
    const voltA = toVolt(req.body.voltA);
    const voltB = toVolt(req.body.voltB);
    const voltC = toVolt(req.body.voltC);

    // New: SCD30 fields (optional)
    const co2ppm  = toCO2(req.body.co2ppm);
    const scdTemp = toDegC(req.body.scdTemp);
    const scdRH   = toRH(req.body.scdRH);

    const state = typeof req.body.state === 'string' ? req.body.state : 'IDLE';
    const now = new Date(); // server time

    // ===== Runtime fields from firmware (authoritative when present) =====
    const fwRuntimeMs   = toNum(req.body.runtime_total_ms);
    const fwRuntimeH    = toNum(req.body.runtime_total_h);
    const fwRuntimeMin  = toNum(req.body.runtime_total_min);
    const fwRuntimeSec  = toNum(req.body.runtime_total_sec);

    const reading = new SensorReading({
      alpha, bravo, charlie, delta, echo,
      voltA: voltA ?? null,
      voltB: voltB ?? null,
      voltC: voltC ?? null,

      // New env fields
      co2ppm:  co2ppm  ?? undefined,
      scdTemp: scdTemp ?? undefined,
      scdRH:   scdRH   ?? undefined,

      // Runtime (firmware authoritative if present)
      runtime_total_ms:  Number.isFinite(fwRuntimeMs)  ? fwRuntimeMs  : undefined,
      runtime_total_h:   Number.isFinite(fwRuntimeH)   ? fwRuntimeH   : undefined,
      runtime_total_min: Number.isFinite(fwRuntimeMin) ? fwRuntimeMin : undefined,
      runtime_total_sec: Number.isFinite(fwRuntimeSec) ? fwRuntimeSec : undefined,

      state,
      timestamp: now,
    });

    await reading.save();
    console.log('✅ Saved new reading:', reading._id);

    // === RuntimeStat mirror ===
    let stat = await RuntimeStat.findOne();
    if (!stat) {
      stat = new RuntimeStat({ totalOnMs: 0, lastState: state, lastTs: now });
    }

    if (Number.isFinite(fwRuntimeMs)) {
      stat.totalOnMs = Math.max(0, fwRuntimeMs);
      stat.lastState = state;
      stat.lastTs = now;
    } else {
      const lastTs = stat.lastTs || now;
      const deltaMs = Math.max(0, now - lastTs);
      if (stat.lastState === 'ACTIVE') {
        stat.totalOnMs += deltaMs;
      }
      stat.lastState = state;
      stat.lastTs = now;
    }
    await stat.save();

    res.status(201).json({
      success: true,
      totalOnMs: stat.totalOnMs,
      totalOnHours: +(stat.totalOnMs / 3600000).toFixed(3),
      totalOnHms: msToHms(stat.totalOnMs),
    });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ error: 'Failed to save reading', detail: String(err) });
  }
});

// ✅ GET /api/data/latest — prefer docs with voltages, else fallback to any
router.get('/latest', async (_req, res) => {
  try {
    const withVolts = await SensorReading.findOne({
      $or: [
        { voltA: { $exists: true } },
        { voltB: { $exists: true } },
        { voltC: { $exists: true } },
      ],
    }).sort({ timestamp: -1 });

    const latestAny = await SensorReading.findOne().sort({ timestamp: -1 });
    const latest = withVolts || latestAny;
    if (!latest) return res.status(404).json({ error: 'No sensor data found' });

    // no caching anywhere
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.json(latest);
  } catch (err) {
    console.error('❌ Latest fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

// ✅ GET /api/data/latest/env — compact env-only payload for UI widgets
router.get('/latest/env', async (_req, res) => {
  try {
    const latest = await SensorReading.findOne().sort({ timestamp: -1 }).lean();
    if (!latest) return res.status(404).json({ error: 'No sensor data found' });

    const payload = {
      co2ppm:  latest.co2ppm ?? null,
      scdTemp: latest.scdTemp ?? null,
      scdRH:   latest.scdRH ?? null,
      timestamp: latest.timestamp || null,
    };

    // no-cache headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.json(payload);
  } catch (err) {
    console.error('❌ Latest env fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch latest env data' });
  }
});

// ✅ GET /api/data/recent?limit=3 — last N docs
router.get('/recent', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit || 5)));
    const rows = await SensorReading.find().sort({ timestamp: -1 }).limit(limit);
    res.json(rows);
  } catch (err) {
    console.error('❌ Recent fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch recent readings' });
  }
});

// ✅ GET /api/data/runtime — cumulative ON time
// Prefers latest reading's firmware runtime; falls back to RuntimeStat.
router.get('/runtime', async (_req, res) => {
  try {
    const latest = await SensorReading.findOne().sort({ timestamp: -1 }).lean();
    let totalOnMsFromReading =
      latest && Number.isFinite(+latest.runtime_total_ms) ? +latest.runtime_total_ms : undefined;

    if (totalOnMsFromReading !== undefined) {
      return res.json({
        totalOnMs: totalOnMsFromReading,
        totalOnHours: +(totalOnMsFromReading / 3600000).toFixed(3),
        totalOnHms: msToHms(totalOnMsFromReading),
        lastState: latest?.state || 'IDLE',
        lastTs: latest?.timestamp || null,
      });
    }

    // Fallback: use accumulated server stat
    const stat = await RuntimeStat.findOne();
    if (!stat) return res.json({ totalOnMs: 0, totalOnHours: 0, totalOnHms: "00:00:00" });
    res.json({
      totalOnMs: stat.totalOnMs,
      totalOnHours: +(stat.totalOnMs / 3600000).toFixed(3),
      totalOnHms: msToHms(stat.totalOnMs),
      lastState: stat.lastState,
      lastTs: stat.lastTs,
    });
  } catch (err) {
    console.error('❌ Runtime read error:', err);
    res.status(500).json({ error: 'Failed to read runtime' });
  }
});

// (Optional) POST /api/data/runtime/reset — zero the counter (server-side mirror)
router.post('/runtime/reset', async (_req, res) => {
  let stat = await RuntimeStat.findOne();
  if (!stat) stat = new RuntimeStat();
  stat.totalOnMs = 0;
  stat.lastTs = new Date();
  await stat.save();
  res.json({ success: true, totalOnMs: 0, totalOnHms: "00:00:00" });
});

// 🔎 Debug: confirm running schema includes volt & runtime & env fields
router.get('/debug/schema', (_req, res) => {
  res.json({ paths: Object.keys(SensorReading.schema.paths) });
});

export default router;
