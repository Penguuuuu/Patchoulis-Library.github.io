const container = document.querySelector('#box-main');
const scrollContent = container.querySelector('.scroll-content');
const scrollbar = container.querySelector('.scrollbar');
const scrollbarThumb = container.querySelector('.scrollbar-thumb');

let dragging = false;
let startY, startThumbTop;

function updateThumbSize() {
    const visibleRatio = scrollContent.clientHeight / scrollContent.scrollHeight;
    const thumbHeight = Math.round(visibleRatio * scrollbar.clientHeight);
    scrollbarThumb.style.height = thumbHeight + 'px';
}

function updateThumbPosition() {
  const maxThumbTop = scrollbar.clientHeight - scrollbarThumb.offsetHeight;
  const scrollRatio = scrollContent.scrollTop / (scrollContent.scrollHeight - scrollContent.clientHeight);
  scrollbarThumb.style.top = (scrollRatio * maxThumbTop) + 'px';
}

function onDrag(e) {
  if (!dragging) return;
  e.preventDefault();

  const deltaY = e.clientY - startY;
  const maxThumbTop = scrollbar.clientHeight - scrollbarThumb.offsetHeight;

  let newThumbTop = Math.min(Math.max(startThumbTop + deltaY, 0), maxThumbTop);
  scrollbarThumb.style.top = newThumbTop + 'px';

  const scrollRatio = newThumbTop / maxThumbTop;
  scrollContent.scrollTop = scrollRatio * (scrollContent.scrollHeight - scrollContent.clientHeight);
}

scrollbarThumb.addEventListener('mousedown', e => {
  dragging = true;
  startY = e.clientY;
  startThumbTop = parseFloat(scrollbarThumb.style.top) || 0;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mouseup', () => {
  dragging = false;
  document.body.style.userSelect = '';
});

document.addEventListener('mousemove', onDrag);
scrollContent.addEventListener('scroll', updateThumbPosition);
window.addEventListener('resize', () => {
  updateThumbSize();
  updateThumbPosition();
});

updateThumbSize();
updateThumbPosition();