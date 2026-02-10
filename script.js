// Load header from header.html
async function loadHeader() {
  try {
    const response = await fetch('header.html');
    const headerHTML = await response.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    if(headerPlaceholder) {
      headerPlaceholder.innerHTML = headerHTML;
      setupDropdown();
    }
  } catch(e) {
    console.error('Failed to load header:', e);
  }
}

// Setup dropdown behavior
function setupDropdown() {
  const dropBtn = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.dropdown');
  
  if(dropBtn && dropdown){
    dropBtn.addEventListener('click', (e)=>{
      const open = dropdown.classList.toggle('open');
      dropBtn.setAttribute('aria-expanded', open);
    });

    // close when clicking outside
    document.addEventListener('click', (e)=>{
      if(!dropdown.contains(e.target)){
        dropdown.classList.remove('open');
        dropBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Ensure dark mode is always enabled
function initPage() {
  const body = document.body;
  body.classList.add('dark');
  loadHeader();
}

// Initialize when DOM is ready
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});
