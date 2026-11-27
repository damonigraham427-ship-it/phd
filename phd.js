// PhD portal path pies — one pie per path, slices = steps.
// Closest equivalent to the exam pies for a non-exam portal: steps are
// marked done by hand (no exam attempts), stored in localStorage key
// 'phdPathDone' (synced via sync.js EXACT_KEYS on this site).
(function () {
  var PATHS = {
    A: { label: 'Path A — via PVAMU', color: '#7c3aed', steps: [
      'Step 0 — NOW', 'Step 1 — Finish the BBA (APUS)', 'Step 2 — SkillBridge → Houston FD',
      'Step 3 — Apply: PVAMU MS', 'Step 4 — PVAMU courses', 'Step 5 — GRE',
      'Step 6 — Apply: TSU MUPEP', 'Step 7 — MUPEP courses', 'Step 8 — Apply: TSU PhD',
      'Step 9 — PhD courses & milestones'] },
    B: { label: 'Path B — TSU only', color: '#2563eb', steps: [
      'Step 0 — NOW', 'Step 1 — Finish the BBA (APUS)', 'Step 2 — SkillBridge → Houston FD',
      'Step 3 — GRE', 'Step 4 — Apply: TSU MUPEP', 'Step 5 — MUPEP courses',
      'Step 6 — Apply: TSU PhD', 'Step 7 — PhD courses & milestones'] }
  };
  var KEY = 'phdPathDone';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  var state = load();
  var selected = { A: null, B: null };

  function polar(cx, cy, r, deg) { var rad = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }
  function slicePath(cx, cy, r, a0, a1) {
    if (a1 - a0 >= 359.99) return null;
    var p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1);
    var large = (a1 - a0) > 180 ? 1 : 0;
    return 'M ' + cx + ' ' + cy + ' L ' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
           ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z';
  }
  function render(key) {
    var P = PATHS[key], mount = document.getElementById('pie-' + key);
    if (!mount) return;
    var done = state[key] || [];
    var n = P.steps.length, cx = 90, cy = 90, r = 84;
    var doneCount = done.filter(Boolean).length;
    var html = '<p><strong>' + P.label + '</strong></p>';
    html += '<svg width="180" height="180" viewBox="0 0 180 180">';
    for (var i = 0; i < n; i++) {
      var a0 = i * 360 / n, a1 = (i + 1) * 360 / n;
      var fill = done[i] ? P.color : '#e5e7eb';
      if (selected[key] === i) fill = done[i] ? P.color : '#c7cede';
      var d = slicePath(cx, cy, r, a0 + 0.7, a1 - 0.7);
      if (d) html += '<path d="' + d + '" fill="' + fill + '" stroke="#fff" stroke-width="1.5" data-pie="' + key + '" data-step="' + i + '" style="cursor:pointer"></path>';
      else html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" data-pie="' + key + '" data-step="' + i + '" style="cursor:pointer"></circle>';
    }
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="46" fill="#fff"></circle>';
    html += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="17" font-weight="bold">' + doneCount + '/' + n + '</text>';
    html += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11">' + Math.round(doneCount / n * 100) + '% done</text>';
    html += '</svg>';
    var sel = selected[key];
    if (sel !== null && sel !== undefined) {
      html += '<p>' + P.steps[sel] + ' — ' + (done[sel] ? 'done' : 'not done') + '</p>';
      html += '<p><button type="button" data-toggle="' + key + '" data-step="' + sel + '">' + (done[sel] ? 'Mark not done' : 'Mark done') + '</button></p>';
    } else {
      html += '<p>Tap a slice to mark a step done.</p>';
    }
    mount.innerHTML = html;
  }
  function renderAll() { render('A'); render('B'); }
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t.getAttribute && t.getAttribute('data-pie')) {
      var k = t.getAttribute('data-pie');
      selected[k] = parseInt(t.getAttribute('data-step'), 10);
      renderAll();
    } else if (t.getAttribute && t.getAttribute('data-toggle')) {
      var k2 = t.getAttribute('data-toggle'), i2 = parseInt(t.getAttribute('data-step'), 10);
      if (!state[k2]) state[k2] = [];
      state[k2][i2] = !state[k2][i2];
      save(state);
      renderAll();
    }
  });
  window.addEventListener('storage', function (ev) { if (ev.key === KEY) { state = load(); renderAll(); } });
  renderAll();
})();
