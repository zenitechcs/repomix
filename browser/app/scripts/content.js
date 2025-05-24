// Function to add Repomix button
function addRepomixButton() {
  // If button already exists, do nothing
  if (document.querySelector('.repomix-button')) {
    return;
  }

  // Get repository main navigation element
  const navActions = document.querySelector('ul.pagehead-actions');
  if (!navActions) {
    return;
  }

  // Get repository information from current URL
  const pathMatch = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (!pathMatch) {
    return;
  }

  const [, owner, repo] = pathMatch;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const repomixUrl = `https://repomix.com/?repo=${encodeURIComponent(repoUrl)}`;

  // Create Repomix button container
  const container = document.createElement('li');

  // Create BtnGroup container
  const btnGroup = document.createElement('div');
  btnGroup.setAttribute('data-view-component', 'true');
  btnGroup.className = 'BtnGroup';

  // Create button
  const button = document.createElement('a');
  button.href = repomixUrl;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.className = 'repomix-button btn-sm btn BtnGroup-item';
  button.setAttribute('data-view-component', 'true');

  // Add icon
  const icon = document.createElement('span');
  icon.className = 'octicon';
  icon.innerHTML = `<img src="${chrome.runtime.getURL('images/icon-64.png')}" width="16" height="16" alt="Repomix">`;

  // Add text with i18n support
  const text = document.createTextNode(' Repomix');
  button.appendChild(icon);
  button.appendChild(text);

  btnGroup.appendChild(button);
  container.appendChild(btnGroup);

  // Add to navigation
  navActions.insertBefore(container, navActions.firstChild);
}

// Execute immediately and on DOMContentLoaded
addRepomixButton();
document.addEventListener('DOMContentLoaded', () => {
  addRepomixButton();
});

// Handle GitHub SPA navigation
let lastUrl = location.href;
const observer = new MutationObserver((mutations) => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      addRepomixButton();
    }, 100);
  }

  // Monitor navigation element addition (only if button doesn't exist)
  mutations.forEach((mutation) => {
    const repomixButton = document.querySelector('.repomix-button');
    if (!repomixButton && mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const navActions = node.querySelector ? node.querySelector('ul.pagehead-actions') : null;
          if (navActions || (node.matches && node.matches('ul.pagehead-actions'))) {
            setTimeout(() => {
              addRepomixButton();
            }, 50);
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
