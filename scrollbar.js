const container = document.querySelector('#box-main');
const scrollContent = container.querySelector('.scroll-content');
const scrollbar = container.querySelector('.scrollbar');

const thumb = document.createElement('div');
thumb.classList.add('scrollbar-thumb');
scrollbar.appendChild(thumb);

let isDragging = false, startY, startTop;

function updateThumb() {
    const ratio = scrollContent.clientHeight / scrollContent.scrollHeight;
    const thumbHeight = Math.round(scrollbar.clientHeight * ratio);
    thumb.style.height = `${thumbHeight}px`;

    const maxTop = scrollbar.clientHeight - thumb.offsetHeight;
    const scrollRatio = scrollContent.scrollTop / (scrollContent.scrollHeight - scrollContent.clientHeight);
    thumb.style.top = `${scrollRatio * maxTop}px`;
}

function onMouseMove(e) {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;
    const maxTop = scrollbar.clientHeight - thumb.offsetHeight;
    const newTop = Math.min(Math.max(startTop + deltaY, 0), maxTop);

    thumb.style.top = `${newTop}px`;
    scrollContent.scrollTop = (newTop / maxTop) * (scrollContent.scrollHeight - scrollContent.clientHeight);
}

thumb.addEventListener('mousedown', e => {
    isDragging = true;
    startY = e.clientY;
    startTop = parseFloat(thumb.style.top) || 0;
    document.body.style.userSelect = 'none';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
});

document.addEventListener('mousemove', onMouseMove);
scrollContent.addEventListener('scroll', updateThumb);
window.addEventListener('resize', updateThumb);

updateThumb();