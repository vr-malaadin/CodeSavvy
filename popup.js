document.getElementById('unlockElements').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: () => {
                document.querySelectorAll('[disabled], .divDisabled, [aria-disabled="true"]').forEach(el => {
                    el.classList.remove('divDisabled');
                    el.removeAttribute('disabled');
                    el.removeAttribute('aria-disabled');
                });
            }
        });
    });
});

document.getElementById('unlimitedMaxLengthButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: () => {
                document.querySelectorAll('[maxlength]').forEach(element => {
                    console.log(element);
                    element.removeAttribute('maxlength');
                });
            }
        });
    });
});

document.getElementById('disableLoader').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: () => {
                document.querySelectorAll('.divLoading').forEach(el => {
                    el.classList.remove('divLoading');
                });
                //document.querySelectorAll('[disabled], .divDisabled').forEach(el => {
                //     el.classList.remove('divDisabled');
                //     el.removeAttribute('disabled');
                // });
            }
        });
    });
});

// Function to update button state based on the current tab's design mode
function updateButtonState(isDesignModeOn) {
    const button = document.getElementById('designModeToggle');
    const buttonIcon = button.querySelector('.button-icon');
    // Explicitly toggle the active class
    if (isDesignModeOn) {
        button.classList.add('active');
        buttonIcon.style.backgroundImage = "url('Icons/switch-on-icon.png')";
    } else {
        button.classList.remove('active');
        buttonIcon.style.backgroundImage = "url('Icons/switch-off-icon.png')";
    }
}

// Function to get the current tab's ID
function getCurrentTabId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    });
}

// Function to get the design mode state for a specific tab
function getDesignModeState(tabId) {
    return new Promise((resolve) => {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.designMode
        }, (results) => {
            resolve(results[0].result === 'on');
        });
    });
}

// Function to set the design mode state for a specific tab
function setDesignModeState(tabId, state) {
    return new Promise((resolve) => {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (newState) => {
                document.designMode = newState ? 'on' : 'off';
                return document.designMode;
            },
            args: [state]
        }, (results) => {
            resolve(results[0].result === 'on');
        });
    });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    const tabId = await getCurrentTabId();
    const isDesignModeOn = await getDesignModeState(tabId);
    updateButtonState(isDesignModeOn);
});

// Handle toggle button click
document.getElementById('designModeToggle').addEventListener('click', async () => {
    const tabId = await getCurrentTabId();
    const currentState = await getDesignModeState(tabId);
    const newState = await setDesignModeState(tabId, !currentState);
    updateButtonState(newState);
});

// Listen for tab updates to keep button state accurate
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const isDesignModeOn = await getDesignModeState(activeInfo.tabId);
    updateButtonState(isDesignModeOn);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const currentTabId = await getCurrentTabId();
        if (tabId === currentTabId) {
            const isDesignModeOn = await getDesignModeState(tabId);
            updateButtonState(isDesignModeOn);
        }
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const currentTabId = await getCurrentTabId();
        if (tabId === currentTabId) {
            const isDesignModeOn = await getDesignModeState(tabId);
            updateButtonState(isDesignModeOn);
        }
    }
});

document.getElementById('clearCacheButton').addEventListener('click', () => {
    chrome.browsingData.remove({
        "since": 0 // Clear all cache
    }, {
        "cache": true
    }, () => {
        console.log("Cache cleared");

        // Reload the current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    });
});

document.getElementById('screenshotButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabTitle = activeTab.title.replace(/[^a-z0-9]/gi, '_');
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${tabTitle}_screenshot.png`;
            a.click();
        });
    });
});

document.getElementById('fullscreenButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                document.documentElement.requestFullscreen();
            },
        });
    });
});

document.getElementById('revealPasswords').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: () => {
                document.querySelectorAll('input[type="password"]').forEach(input => {
                    input.setAttribute('type', 'text');
                });
            }
        });
    });
});

