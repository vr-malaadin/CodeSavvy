document.getElementById('unlockElements').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: () => {
                document.querySelectorAll('[disabled], .divDisabled, [aria-disabled="true"], [readonly]').forEach(el => {
                    ['divDisabled', 'disabled', 'aria-disabled', 'readonly'].forEach(cls => el.classList.remove(cls));
                    ['disabled', 'aria-disabled', 'readonly'].forEach(attr => el.removeAttribute(attr));
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
            }
        });
    });
});

// Function to update button state based on the current tab's design mode
function updateButtonState(isDesignModeOn) {
    const button = document.getElementById('designModeToggle');
    if (isDesignModeOn)
        button.classList.add('active');
    else
        button.classList.remove('active');
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



document.getElementById('changeFont').addEventListener('click', () => {
    document.getElementById('fontModal').style.display = 'flex';
});

document.getElementById('applyFont').addEventListener('click', () => {
    const fontSelector = document.getElementById('fontSelector');
    const selectedFont = fontSelector.value;

    // List of system fonts that don't require import
    const systemFonts = [
        "Comic Sans MS", "Tahoma", "Trebuchet MS", "Lucida Sans Unicode",
        "Lucida Grande", "Palatino", "Impact", "Wingdings", "Arial Black",
        "Consolas", "Segoe UI", "Helvetica", "Helvetica Neue", "Times"
    ];

    // URLs for the Google Fonts
    const googleFontsUrl = {
        'Poppins': "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
        'Lexend Deca': "https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap",
        'EB Garamond': "https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap",
        'STIX Two Text': "https://fonts.googleapis.com/css2?family=STIX+Two+Text&display=swap",
        'Andika': "https://fonts.googleapis.com/css2?family=Andika&display=swap",
        'Atkinson Hyperlegible': "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&display=swap",
        'Roboto': "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
        'Lato': "https://fonts.googleapis.com/css2?family=Lato&display=swap",
        'Open Sans': "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
        'Oswald': "https://fonts.googleapis.com/css2?family=Oswald&display=swap",
        'Montserrat': "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
        'Merriweather': "https://fonts.googleapis.com/css2?family=Merriweather&display=swap",
        'Raleway': "https://fonts.googleapis.com/css2?family=Raleway&display=swap",
        'Lora': "https://fonts.googleapis.com/css2?family=Lora&display=swap",
        'Playfair Display': "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap",
        'Ubuntu': "https://fonts.googleapis.com/css2?family=Ubuntu&display=swap"
    };

    // Check if the selected font is a system font (i.e., no need to import)
    if (systemFonts.includes(selectedFont)) {
        // No need to load any Google Font, just apply the system font directly
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (font) => {
                    document.querySelectorAll('*:not(code):not(pre):not([class*="code"])').forEach(element => {
                        element.style.fontFamily = font;
                    });
                },
                args: [selectedFont]
            });
        });
    } else {
        // If the font is a Google Font, load it and apply it
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (font, fontUrl) => {
                    let link = document.querySelector(`link[href="${fontUrl}"]`);
                    if (!link) {
                        // Create a link tag for the font if not already loaded
                        link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = fontUrl;
                        document.head.appendChild(link);
                    }

                    // Apply the font to all elements except code sections
                    document.querySelectorAll('*:not(code):not(pre):not([class*="code"])').forEach(element => {
                        element.style.fontFamily = font;
                    });
                },
                args: [selectedFont, googleFontsUrl[selectedFont]]
            });
        });
    }

    document.getElementById('fontModal').style.display = 'none';
});




document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('fontModal').style.display = 'none';
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

//document.getElementById('blackFont').addEventListener('click', () => {
//    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//        let activeTabId = tabs[0].id;
//        chrome.scripting.executeScript({
//            target: { tabId: activeTabId },
//            func: () => {
//                const style = document.createElement('style');
//                style.innerHTML = `
//  *:not(code, code *, pre, pre *) {
//    color: #000000 !important;
//  }
//`;
//                document.head.appendChild(style);
//            }
//        });
//    });
//});