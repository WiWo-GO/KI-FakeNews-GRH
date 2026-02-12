console.debug('script.js loaded');

// Load header from header.html
async function loadHeader() {
  try {
    const response = await fetch('header.html');
    if(!response.ok) throw new Error('Header fetch failed: ' + response.status + ' ' + response.statusText);
    const headerHTML = await response.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    if(headerPlaceholder) {
      headerPlaceholder.innerHTML = headerHTML;
      // Attach per-header listeners as a fallback for environments where delegated handlers miss targets
      attachHeaderListeners(headerPlaceholder);
    }
  } catch(e) {
    console.error('Failed to load header (are you opening the file via file://? Try a local server):', e);
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
  function setupMobileMenu(){
    // Delegated handlers: single document listener to handle menu and dropdown clicks
    function setupDelegatedMenuHandlers(){
      // remove previous handlers if present to avoid duplicates
      if(window.__delegatedMenuHandler){
        document.removeEventListener('click', window.__delegatedMenuHandler);
        window.__delegatedMenuHandler = null;
      }
      if(window.__delegatedMenuKeyHandler){
        document.removeEventListener('keydown', window.__delegatedMenuKeyHandler);
        window.__delegatedMenuKeyHandler = null;
      }

      const clickHandler = function(e){
        const dropBtn = e.target.closest && e.target.closest('.dropbtn');
        const menuToggle = e.target.closest && e.target.closest('.menu-toggle');

        // Toggle Themen dropdown
        if(dropBtn){
          console.debug('dropbtn clicked', dropBtn);
          e.preventDefault();
          e.stopPropagation();
          const dropdown = dropBtn.closest('.dropdown');
          if(dropdown){
            const isOpen = dropdown.classList.toggle('open');
            dropBtn.setAttribute('aria-expanded', isOpen);
          }
          return;
        }

        // Toggle mobile menu
        if(menuToggle){
          console.debug('menu-toggle clicked', menuToggle);
          e.preventDefault();
          e.stopPropagation();
          const header = document.querySelector('.site-header');
          if(header){
            const isOpen = header.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
          }
          return;
        }

        // Click outside: close any open dropdowns and mobile menu
        const openDropdown = document.querySelector('.dropdown.open');
        if(openDropdown && !openDropdown.contains(e.target)){
          console.debug('closing open dropdown');
          openDropdown.classList.remove('open');
          const btn = openDropdown.querySelector('.dropbtn');
          btn && btn.setAttribute('aria-expanded','false');
        }

        const header = document.querySelector('.site-header.open');
        if(header && !header.contains(e.target)){
          console.debug('closing mobile header');
          header.classList.remove('open');
          const mt = header.querySelector('.menu-toggle');
          mt && mt.setAttribute('aria-expanded','false');
        }
      };

      const keyHandler = function(e){
        if(e.key === 'Escape'){
          const openDropdown = document.querySelector('.dropdown.open');
          if(openDropdown){
            openDropdown.classList.remove('open');
            const btn = openDropdown.querySelector('.dropbtn');
            btn && btn.setAttribute('aria-expanded','false');
          }
          const header = document.querySelector('.site-header.open');
          if(header){
            header.classList.remove('open');
            const mt = header.querySelector('.menu-toggle');
            mt && mt.setAttribute('aria-expanded','false');
          }
        }
      };

      document.addEventListener('click', clickHandler);
      document.addEventListener('keydown', keyHandler);

      window.__delegatedMenuHandler = clickHandler;
      window.__delegatedMenuKeyHandler = keyHandler;
    }
    const menuToggle = document.querySelector('.menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const dropdown = document.querySelector('.dropdown');

    if(!menuToggle || !siteHeader) return;

    menuToggle.addEventListener('click', (e)=>{
      const open = siteHeader.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });

    // close menu when clicking outside
    document.addEventListener('click', (e)=>{
      if(!siteHeader.contains(e.target)){
        siteHeader.classList.remove('open');
        if(menuToggle) menuToggle.setAttribute('aria-expanded','false');
      }
    });

    // ensure dropdown inside mobile menu still works
    if(dropdown){
      const dropBtn = dropdown.querySelector('.dropbtn');
      dropBtn && dropBtn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const open = dropdown.classList.toggle('open');
        dropBtn.setAttribute('aria-expanded', open);
      });
    }
  }

// Ensure dark mode is always enabled
function initPage() {
  const body = document.body;
  body.classList.add('dark');
  loadHeader();
  setupDelegatedMenuHandlers();
}

// Attach listeners directly to the injected header (guarded)
function attachHeaderListeners(container){
  if(!container) return;

  try{
    const dropBtn = container.querySelector('.dropbtn');
    const dropdown = container.querySelector('.dropdown');
    const menuToggle = container.querySelector('.menu-toggle');

    if(dropBtn && dropdown && !dropBtn.dataset.attached){
      dropBtn.addEventListener('click', function(e){
        e.stopPropagation();
        const open = dropdown.classList.toggle('open');
        dropBtn.setAttribute('aria-expanded', open);
      });
      dropBtn.dataset.attached = '1';
      console.debug('attached dropbtn listener');
    }

    if(menuToggle && !menuToggle.dataset.attached){
      menuToggle.addEventListener('click', function(e){
        e.stopPropagation();
        const header = document.querySelector('.site-header');
        const open = header && header.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', !!open);
      });
      menuToggle.dataset.attached = '1';
      console.debug('attached menu-toggle listener');
    }
  }catch(err){
    console.error('attachHeaderListeners error', err);
  }
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
