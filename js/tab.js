(() => {
  const $root = document.querySelector('.tabs');
  if (!$root) return;

  const $tabs = $root.querySelectorAll('.tabs-link');
  const $line = $root.querySelector('.tabs-line');
  if (!$tabs.length || !$line) return;

  const $header = $root.querySelector('.tabs-header'); // sticky 되는 헤더
  const getHeaderOffset = () => {
    if (!$header) return 0;
    const styles = window.getComputedStyle($header);
    const top = parseFloat(styles.top) || 0; // sticky top 값(있으면)
    return $header.offsetHeight + top;
  };

  const scrollToContentTop = (divId) => {
    const $content = $root.querySelector(divId);
    if (!$content) return;

    const headerOffset = getHeaderOffset();
    const y = window.scrollY + $content.getBoundingClientRect().top - headerOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const getPos = ($currentTarget) => {
    const $parentContainer = $root.querySelector('.tabs-header ul');
    return {
      top: $currentTarget.offsetTop - $parentContainer.offsetTop,
      left: $currentTarget.offsetLeft - $parentContainer.offsetLeft
    };
  };

  const animateLine = ($currentTarget, $l) => {
    const currentWidth = $currentTarget.offsetWidth;
    const currentPos = getPos($currentTarget);
    $l.style.left = `${currentPos.left}px`;
    $l.style.width = `${currentWidth}px`;
  };

  const onLoadLine = () => {
    const $onLoadActive = $root.querySelector('.tabs-active');
    if (!$onLoadActive) return;
    const divId = $onLoadActive.getAttribute('href');
    animateLine($onLoadActive, $line);
    $root.querySelector(divId)?.classList.add('tabs-content-active');
  };

  const setActive = (e) => {
    e.preventDefault();
    const divId = e.currentTarget.getAttribute('href');

    $tabs.forEach($tab => $tab.classList.remove('tabs-active'));
    $root.querySelectorAll('.tabs-content').forEach($content => {
      $content.classList.remove('tabs-content-active');
    });

    e.currentTarget.classList.add('tabs-active');
    $root.querySelector(divId)?.classList.add('tabs-content-active');

    // ✅ 스크롤이 내려간 상태에서 탭 누르면 콘텐츠 상단으로 정렬
    scrollToContentTop(divId);

    return divId;
  };

  onLoadLine();

  $tabs.forEach($tab => {
    $tab.addEventListener('click', (e) => {
      const divId = setActive(e);
      animateLine(e.currentTarget, $line);
    });
  });
})();
