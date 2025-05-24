// This background.ts is kept minimal as all implementation is handled in content_scripts

const injectContentToTab = async (tab: chrome.tabs.Tab): Promise<void> => {
  // Skip if URL is undefined
  if (!tab.url) {
    return;
  }

  // Skip if tab is discarded
  if (tab.discarded) {
    return;
  }

  // Skip if tab ID is undefined
  if (tab.id === undefined) {
    return;
  }

  // Skip if not a GitHub URL
  if (!tab.url.startsWith('https://github.com/')) {
    return;
  }

  try {
    const manifest = chrome.runtime.getManifest();

    // Inject CSS
    if (manifest.content_scripts?.[0]?.css) {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: manifest.content_scripts[0].css,
      });
    }

    // Inject JavaScript
    if (manifest.content_scripts?.[0]?.js) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: manifest.content_scripts[0].js,
      });
    }
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
};

// Handle installation
chrome.runtime.onInstalled.addListener(async (): Promise<void> => {
  console.log('Repomix extension installed');

  try {
    // Get all GitHub tabs
    const tabs = await chrome.tabs.query({
      url: 'https://github.com/*',
    });

    // Inject content script to existing GitHub tabs
    for (const tab of tabs) {
      await injectContentToTab(tab);
    }
  } catch (error) {
    console.error('Error during installation:', error);
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(
  async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): Promise<void> => {
    // Only inject when page is completely loaded
    if (changeInfo.status === 'complete') {
      await injectContentToTab(tab);
    }
  },
);
