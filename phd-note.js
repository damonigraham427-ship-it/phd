// PhD portal — notes box: Damoni types a note, Send puts it in Edison's
// inbox through the same Firestore outbox as the exam Quality / Further
// research reports (type 'phd-note', page 'phd').
(function () {
  var btn = document.getElementById('phd-note-send');
  var ta = document.getElementById('phd-note-text');
  var status = document.getElementById('phd-note-status');
  if (!btn || !ta || !status) return;
  btn.addEventListener('click', function () {
    var text = (ta.value || '').trim();
    if (!text) { status.textContent = 'Write the note first.'; return; }
    var report = {
      id: 'phd' + Date.now(),
      ts: new Date().toISOString(),
      page: 'phd',
      type: 'phd-note',
      file: 'phd-portal',
      groups: [{ title: 'PhD portal \u2014 note to Edison', items: [{ n: 1, question: 'PhD portal note', topic: '', correct: '', explanation: '', comment: text, result: '' }] }]
    };
    btn.disabled = true;
    status.textContent = 'Sending\u2026';
    var done = false;
    var wait = setInterval(function () {
      if (window.examSync) {
        clearInterval(wait);
        window.examSync.sendReport(report).then(function () {
          done = true;
          status.textContent = 'Sent \u2713 \u2014 Edison has it.';
          ta.value = '';
          btn.disabled = false;
        }).catch(function () {
          status.textContent = 'Could not send \u2014 sign in to sync first (blue bar at the top), then try again.';
          btn.disabled = false;
        });
      }
    }, 200);
    setTimeout(function () {
      clearInterval(wait);
      if (!done && btn.disabled) {
        status.textContent = 'Could not send \u2014 sign in to sync first (blue bar at the top), then try again.';
        btn.disabled = false;
      }
    }, 12000);
  });
})();

// Per-step notes boxes (Damoni, Nov 27, 2026): one small box beside each
// step card on Path A (Steps 0-9) and Path B (Steps 0-7). Each note is
// tagged with its path + step so Edison knows which box it came from.
(function () {
  function sendReport(report, status, btn, ta) {
    btn.disabled = true;
    status.textContent = 'Sending\u2026';
    var done = false;
    var wait = setInterval(function () {
      if (window.examSync) {
        clearInterval(wait);
        window.examSync.sendReport(report).then(function () {
          done = true;
          status.textContent = 'Sent \u2713 \u2014 Edison has it.';
          ta.value = '';
          btn.disabled = false;
        }).catch(function () {
          status.textContent = 'Could not send \u2014 sign in to sync first (blue bar at the top), then try again.';
          btn.disabled = false;
        });
      }
    }, 200);
    setTimeout(function () {
      clearInterval(wait);
      if (!done && btn.disabled) {
        status.textContent = 'Could not send \u2014 sign in to sync first (blue bar at the top), then try again.';
        btn.disabled = false;
      }
    }, 12000);
  }

  var path = null;
  // Path headings are standalone h2s between the step cards, so walk
  // every h2 in document order and track which path we are inside.
  var headings = document.querySelectorAll('h2');
  headings.forEach(function (h2) {
    var heading = h2.textContent || '';
    if (/^Path A/.test(heading)) { path = 'A'; return; }
    if (/^Path B/.test(heading)) { path = 'B'; return; }
    var m = heading.match(/^Step (\d+)\s*\u2014\s*(.*)$/);
    if (!m || !path) return;
    var card = h2.closest('section');
    if (!card) return;
    var step = m[1];
    var title = m[2];
    var label = 'Path ' + path + ' Step ' + step;
    var wrap = document.createElement('div');
    wrap.className = 'step-note';
    wrap.innerHTML = '<p style="margin:8px 0 4px"><strong>Note to Edison \u2014 ' + label + '</strong></p>' +
      '<p style="margin:4px 0"><textarea rows="2" style="width:100%"></textarea></p>' +
      '<p style="margin:4px 0"><button type="button">Send to Edison</button> <span class="step-note-status"></span></p>';
    card.appendChild(wrap);
    var ta = wrap.querySelector('textarea');
    var btn = wrap.querySelector('button');
    var status = wrap.querySelector('.step-note-status');
    btn.addEventListener('click', function () {
      var text = (ta.value || '').trim();
      if (!text) { status.textContent = 'Write the note first.'; return; }
      var report = {
        id: 'phd' + Date.now(),
        ts: new Date().toISOString(),
        page: 'phd',
        type: 'phd-note',
        file: 'phd-portal',
        groups: [{ title: 'PhD portal \u2014 note to Edison \u2014 ' + label, items: [{ n: 1, question: 'PhD portal note \u2014 ' + label + ': ' + title, topic: label, correct: '', explanation: '', comment: text, result: '' }] }]
      };
      sendReport(report, status, btn, ta);
    });
  });
})();
