/** Replay the driver's charge events into the frame timeline. */
export function buildGaugeSeries(events, maxFrame, gaugeMax) {
  const series = new Map(), phases = new Map(), readyTick = new Map();
  const fill = new Map([[0, 0], [1, 0]]), phase = new Map([[0, 0], [1, 0]]);
  for (const team of [0, 1]) { series.set(team, new Float32Array(maxFrame + 1)); phases.set(team, new Uint8Array(maxFrame + 1)); }
  const byTick = new Map();
  for (const e of events) {
    if (!['HIT', 'BURST_CHARGE', 'BURST_READY', 'BURST_START', 'BURST_END'].includes(e.type)) continue;
    if (!byTick.has(e.tick)) byTick.set(e.tick, []);
    byTick.get(e.tick).push(e);
  }
  for (let f = 0; f <= maxFrame; f++) {
    const tick = Math.floor(f / 2);
    if (f % 2 === 0) for (const e of byTick.get(tick) ?? []) {
      const team = e.team ?? 0;
      if (!fill.has(team)) continue;
      if (e.type === 'HIT' || e.type === 'BURST_CHARGE') {
        if (e.dropped || phase.get(team) === 2) continue;
        fill.set(team, Math.max(0, Math.min(gaugeMax, fill.get(team) + e.charge)));
      } else if (e.type === 'BURST_READY') {
        if (!readyTick.has(team)) readyTick.set(team, tick);
        phase.set(team, 1); fill.set(team, gaugeMax);
      } else if (e.type === 'BURST_START') phase.set(team, 2);
      else if (e.type === 'BURST_END') { phase.set(team, 0); fill.set(team, 0); }
    }
    for (const team of [0, 1]) { series.get(team)[f] = fill.get(team) / gaugeMax; phases.get(team)[f] = phase.get(team); }
  }
  return { max:gaugeMax, series, phases, readyTick };
}
