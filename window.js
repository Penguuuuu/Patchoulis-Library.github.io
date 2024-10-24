function adjustForScrollbar() {
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingLeft = scrollbarWidth + 'px';
}

document.addEventListener('DOMContentLoaded', adjustForScrollbar);
window.addEventListener('resize', adjustForScrollbar);