chrome.contextMenus.create({
  id: "textActions",
  title: "Text Actions (Beta)",
  contexts: ["selection"],
});

const actions = [
  { id: "highlightText", title: "Highlight Text" },
  { id: "sentenceCase", title: "Sentence case" },
  { id: "lowerCase", title: "lower case" },
  { id: "upperCase", title: "UPPER CASE" },
  { id: "capitalizedCase", title: "Capitalized Case" },
  { id: "alternatingCase", title: "altErNaTiNg CASE" },
  { id: "inverseCase", title: "InVeRsE CaSe" },
  { id: "titleCase", title: "Title Case" },
  { id: "slugify", title: "Slugify" },
];

actions.forEach((action) => {
  chrome.contextMenus.create({
    id: action.id,
    parentId: "textActions",
    title: action.title,
    contexts: ["selection"],
  });
});

// Listen for clicks on the context menu items
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlightText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: highlightSelectedText,
    });
  } else if (actions.map((a) => a.id).includes(info.menuItemId)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertCase,
      args: [info.menuItemId],
    });
  }
});

function highlightSelectedText() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.backgroundColor = 'yellow';
  span.style.color = 'black';
  
  try {
    range.surroundContents(span);
  } catch (e) {
    console.error('Could not highlight text:', e);
  }
}

function convertCase(caseType) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const fragment = range.cloneContents();
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(fragment);

  // Process all text nodes within the selection
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    let text = node.textContent;
    let convertedText = '';
    
    switch (caseType) {
      case 'sentenceCase':
        convertedText = text.toLowerCase();
        convertedText = convertedText.charAt(0).toUpperCase() + convertedText.slice(1);
        break;
        
      case 'lowerCase':
        convertedText = text.toLowerCase();
        break;
        
      case 'upperCase':
        convertedText = text.toUpperCase();
        break;
        
      case 'capitalizedCase':
        convertedText = text.toLowerCase().split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
        
      case 'alternatingCase':
        convertedText = text.split('')
          .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join('');
        break;
        
      case 'inverseCase':
        convertedText = text.split('')
          .map(char => {
            if (char === char.toUpperCase()) return char.toLowerCase();
            return char.toUpperCase();
          })
          .join('');
        break;
        
      case 'titleCase':
        convertedText = text.toLowerCase().split(' ')
          .map((word, index) => {
            // Don't capitalize certain small words unless they're the first word
            const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
            if (index > 0 && smallWords.includes(word)) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        break;
        
      case 'slugify':
        convertedText = text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/-+/g, '-');     // Remove consecutive hyphens
        break;
    }
    
    node.textContent = convertedText;
  }

  // Replace the selected content with the modified content
  range.deleteContents();
  range.insertNode(tempDiv);
  
  // Remove the temporary div but keep its contents
  const parent = tempDiv.parentNode;
  while (tempDiv.firstChild) {
    parent.insertBefore(tempDiv.firstChild, tempDiv);
  }
  parent.removeChild(tempDiv);
}