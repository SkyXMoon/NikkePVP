/* Local comparison entry: /v2core/index.html?compare=1 */
(function () {
  if (new URLSearchParams(location.search).get('compare') !== '1') return;

  const originalMarkup = globalThis.getChargeChartMarkup;
  const options = { endFrame: 120, v1: true, v2: true };
  const colors = { v1: '#38bdf8', v2: '#fb923c' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function calculateV1() {
    return globalThis.__V2_WITH_V1__(() => isPaidArenaModeActive()
      ? getActivePaidArenaChartResults()
      : computeBattleResults());
  }

  function pointsFor(result, positionIndex) {
    return (result?.timeline ?? []).flatMap(event => (event.contributions ?? [])
      .filter(part => part.positionIndex === positionIndex && part.showOnMember !== false)
      .map(part => ({ frame: event.frame / 2, charge: part.charge,
        cumulativeCharge: part.cumulativeCharge })));
  }

  function renderComparison(v1, v2) {
    const left = 210;
    const width = Math.max(800, left + options.endFrame * 7 + 24);
    const x = frame => left + frame / options.endFrame * (width - left - 24);
    const rows = [];
    const summaries = [];
    for (const [key, label] of [['defenseResult', '防守'], ['attackResult', '进攻']]) {
      const a = v1[key];
      const b = v2[key];
      const members = b?.members ?? a?.members ?? [];
      if (!members.length) continue;
      const fullFrameLabel = result => result?.error ? escape(result.error)
        : Number.isFinite(result?.fullFrame) ? `${result.fullFrame / 2}F` : '—';
      summaries.push(`${label}满槽 V1 ${fullFrameLabel(a)} / V2 ${fullFrameLabel(b)}`);
      for (const member of members) {
        rows.push({ label: `${label} P${member.positionIndex + 1} ${member.character.name}`,
          v1: pointsFor(a, member.positionIndex), v2: pointsFor(b, member.positionIndex) });
      }
    }
    const height = 48 + rows.length * 42;
    const grid = [];
    for (let frame = 0; frame <= options.endFrame; frame += 10) {
      grid.push(`<line x1="${x(frame)}" x2="${x(frame)}" y1="26" y2="${height - 12}" stroke="#334155"/>`);
      grid.push(`<text x="${x(frame)}" y="17" text-anchor="middle" fill="#cbd5e1" font-size="11">${frame}F</text>`);
    }
    const marks = rows.map((row, index) => {
      const y = 48 + index * 42;
      const groups = ['v1', 'v2'].map(version => {
        const points = row[version].filter(point => point.frame >= 0 && point.frame <= options.endFrame);
        const circles = points.map(point => {
          const title = `${version.toUpperCase()} · ${row.label} · ${point.frame}F · 充能 ${point.charge}% · 累计 ${point.cumulativeCharge}%`;
          return `<circle cx="${x(point.frame)}" cy="${y}" r="${version === 'v1' ? 5 : 2.5}" fill="${version === 'v1' ? 'none' : colors[version]}" stroke="${colors[version]}" stroke-width="1.5" data-compare-frame="${point.frame}"><title>${escape(title)}</title></circle>`;
        }).join('');
        return `<g data-compare-version="${version}"${options[version] ? '' : ' display="none"'}>${circles}</g>`;
      }).join('');
      return `<text x="6" y="${y + 4}" fill="#e2e8f0" font-size="12">${escape(row.label)}</text><line x1="${left}" x2="${width - 24}" y1="${y}" y2="${y}" stroke="#475569"/>${groups}`;
    }).join('');
    globalThis.__V2_COMPARISON__ = { v1, v2, rows, originTick: 6, framesPerTick: 1 };
    return `<section class="v2-comparison" style="padding:12px;background:#111827;border-radius:8px;color:#e2e8f0">
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
        <strong>V1 / V2 同轴对照</strong>
        ${['v1', 'v2'].map(version => `<label style="color:${colors[version]}"><input type="checkbox" data-compare-toggle="${version}"${options[version] ? ' checked' : ''}> ${version.toUpperCase()} ${version === 'v1' ? '空心' : '实心'}</label>`).join('')}
        <label>范围 <select data-compare-range>${[60, 120, 180, 300].map(frame => `<option value="${frame}"${frame === options.endFrame ? ' selected' : ''}>${frame}F</option>`).join('')}</select></label>
      </div>
      <div style="font-size:12px;margin-bottom:8px">30fps逻辑帧，共同起手为0F。圆点为充能入账，重合时呈蓝环橙芯。</div>
      <div style="font-size:12px;margin-bottom:8px">${summaries.join('　') || '选择队伍后显示两版充能点'}</div>
      <div style="overflow-x:auto"><svg data-v1-v2-axis="true" data-label-gutter="${CHART_LABEL_GUTTER}" viewBox="0 0 ${width} ${height}" style="width:${width}px;max-width:none;height:${height}px" role="img" aria-label="V1与V2共同起手充能时间轴">${grid.join('')}${marks}</svg></div>
    </section>`;
  }

  globalThis.getChargeChartMarkup = function (result, gutter, defenseResult, chartSize) {
    try {
      return renderComparison(calculateV1(), { attackResult: result, defenseResult });
    } catch (error) {
      console.error('[v2compare]', error);
      return `<p role="alert">同轴对照计算失败 ${escape(error.message)}</p>` +
        originalMarkup.call(this, result, gutter, defenseResult, chartSize);
    }
  };

  document.addEventListener('change', event => {
    const version = event.target.dataset.compareToggle;
    if (version) options[version] = event.target.checked;
    else if (event.target.matches('[data-compare-range]')) options.endFrame = Number(event.target.value);
    else return;
    renderResults();
  });
  addEventListener('v2charge:ready', () => {
    invalidateBattleResults();
    renderResults();
  });
})();
