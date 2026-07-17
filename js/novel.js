(function () {
  'use strict';

  var body = document.body;
  var chapter = document.getElementById('chapter-body');
  var progress = document.getElementById('reading-progress-bar');
  var themeButton = document.getElementById('reader-theme-toggle');
  var sizeButtons = document.querySelectorAll('[data-reader-size]');

  if (!chapter) return;

  var minimumSize = 17;
  var maximumSize = 24;
  var currentSize = 20;

  try {
    var storedSize = Number(window.localStorage.getItem('novel-reader-font-size'));
    if (storedSize >= minimumSize && storedSize <= maximumSize) currentSize = storedSize;
    if (window.localStorage.getItem('novel-reader-theme') === 'night') body.classList.add('novel-night');
  } catch (error) {
    // 阅读偏好不可用时继续使用默认设置。
  }

  function applySize() {
    document.documentElement.style.setProperty('--reader-font-size', currentSize + 'px');
    try {
      window.localStorage.setItem('novel-reader-font-size', String(currentSize));
    } catch (error) {}
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var isNight = body.classList.contains('novel-night');
    themeButton.textContent = isNight ? '纸张' : '夜间';
    themeButton.setAttribute('aria-label', isNight ? '切换到纸张模式' : '切换到夜间模式');
  }

  Array.prototype.forEach.call(sizeButtons, function (button) {
    button.addEventListener('click', function () {
      var direction = Number(button.getAttribute('data-reader-size')) || 0;
      currentSize = Math.min(maximumSize, Math.max(minimumSize, currentSize + direction));
      applySize();
    });
  });

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      body.classList.toggle('novel-night');
      var mode = body.classList.contains('novel-night') ? 'night' : 'paper';
      try {
        window.localStorage.setItem('novel-reader-theme', mode);
      } catch (error) {}
      updateThemeLabel();
    });
  }

  var scheduled = false;
  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? Math.min(100, Math.max(0, scrollTop / scrollable * 100)) : 0;
    if (progress) progress.style.width = percent + '%';
    scheduled = false;
  }

  window.addEventListener('scroll', function () {
    if (!scheduled) {
      window.requestAnimationFrame(updateProgress);
      scheduled = true;
    }
  }, { passive: true });

  applySize();
  updateThemeLabel();
  updateProgress();
})();
