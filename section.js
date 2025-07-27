const observer = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        document.querySelectorAll('.nav-section.active').forEach(el => el.classList.remove('active'));
        const group = target.id.split('-').pop();
        const navSection = [...document.querySelectorAll('.nav-section a')]
        .find(a => a.getAttribute('data-section')?.endsWith(group)) ?.parentElement;
        navSection?.classList.add('active');
  });
});

const sectionsToObserve = [...document.querySelectorAll('#box-nav a')]
    .map(link => link.getAttribute('href'))
    .filter(href => href?.startsWith('#'))
    .map(id => document.getElementById(id.substring(1)))
    .filter(Boolean);

sectionsToObserve.forEach(section => observer.observe(section));
