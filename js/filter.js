document.addEventListener('DOMContentLoaded', () => {
  let selectedClass = '';
  const filterItems = document.querySelectorAll('#filter > p');
  const portfolio = document.querySelector('.portfolio-img');
  const portfolioItems = document.querySelectorAll('.portfolio-img li');

  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      filterItems.forEach((p) => p.classList.remove('on'));
      item.classList.add('on');

      selectedClass = item.getAttribute('data-rel');

      if (portfolio) {
        portfolio.style.opacity = '0';
      }

      portfolioItems.forEach((li) => {
        if (!li.classList.contains(selectedClass)) {
          li.style.display = 'none';
        }
      });

      setTimeout(() => {
        portfolioItems.forEach((li) => {
          if (li.classList.contains(selectedClass)) {
            li.style.display = '';
          }
        });

        if (portfolio) {
          portfolio.style.opacity = '1';
        }
      }, 500);
    });
  });
});