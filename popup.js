document.getElementById('unlockElements').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: activeTabId},
            func: () => {
                document.querySelectorAll('[disabled], .divDisabled').forEach(el => {
                    el.classList.remove('divDisabled');
                    el.removeAttribute('disabled');
                });
            }
        });
    });
});

document.getElementById('unlimitedMaxLengthButton').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: activeTabId},
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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: activeTabId},
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
    button.textContent = isDesignModeOn ? 'Turn Design Mode Off' : 'Turn Design Mode On';
    button.classList.toggle('active', isDesignModeOn);
}

// Function to get the current tab's ID
function getCurrentTabId() {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            resolve(tabs[0].id);
        });
    });
}

// Function to get the design mode state for a specific tab
function getDesignModeState(tabId) {
    return new Promise((resolve) => {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
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
            target: {tabId: tabId},
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