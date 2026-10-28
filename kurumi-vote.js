(() => {
  function updateVotingStatus() {
    document.querySelectorAll('[data-vote-end]').forEach(panel => {
      if (Date.now() < Date.parse(panel.dataset.voteEnd) || panel.classList.contains('is-ended')) return;
      panel.classList.add('is-ended');
      panel.querySelector('[data-vote-status]').textContent = 'WEB投票は終了しました';
      panel.querySelector('[data-vote-link]').textContent = '公式の投票ページを見る ▶';
      panel.querySelectorAll('[data-vote-active]').forEach(element => { element.hidden = true; });
    });
  }
  updateVotingStatus();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateVotingStatus(); });
})();
