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
