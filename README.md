# **CodeSavvy Extension**

A powerful browser extension designed to enhance web page interactions by unlocking elements, removing loaders, clearing cache, toggling design mode, taking screenshots, making web pages full screen, revealing passwords, changing fonts, and performing text transformations effortlessly. Ideal for developers and power users looking to manipulate web pages in real-time.

---

## **Features**

1. **Unlock Elements**  
   Removes the `disabled` attribute and specific classes (`divDisabled`) from elements (Specific for Vanrise), making them editable.

2. **Unlimited MaxLength**  
   Removes `maxlength` restrictions from input fields to allow unlimited characters.

3. **Disable Loaders**  
   Removes loading indicators (e.g., elements with the `divLoading` class) from web pages (Specific for Vanrise).

4. **Toggle Design Mode**  
   Enables or disables the browser's design mode, allowing direct editing of the web page's content.

5. **Clear Cache**  
   Clears the browser cache and reloads the current tab.

6. **Take Screenshots**  
   Captures a screenshot of the visible part of the current tab and saves it with the tab's title as the file name.

7. **Make Page Full Screen**  
   Expands the web page to full screen, providing an immersive view.

8. **Reveal Passwords**  
   Converts password input fields to plain text, making it easier to view hidden passwords.

9. **Change Font**  
   Allows you to change the font of web page content (except for code sections) by selecting from a variety of fonts.

10. **Text Actions (Beta)**  
    Provides a context menu with various text transformation options that appear when the user selects text. The available actions include:
    - Highlight Text
    - Sentence case
    - lower case
    - UPPER CASE
    - Capitalized Case
    - altErNaTiNg CASE
    - InVeRsE CaSe
    - Title Case
    - Slugify

    **Note:** Text Actions are currently in **Beta** and may undergo further improvements.

---

## **Preview**

Below is a preview of the CodeSavvy extension interface:

![image](https://github.com/user-attachments/assets/14ccf8b9-3934-415c-ae0e-ef803f015b74)

The clean and compact design ensures quick access to tools like unlocking elements, disabling loaders, clearing cache, and more.

### Text Actions Context Menu (Beta)
Here’s a screenshot of the **Text Actions** context menu in action:

![image](https://github.com/user-attachments/assets/52e3709a-660b-4647-898e-c1186ec039e2)


---

## **Installation**

### 1. Clone the Repository
```bash
git clone https://github.com/vr-malaadin/CodeSavvy.git
```

### 2. Load the Extension
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select the project folder.

---

## **Usage**

### Buttons:
- **Unlock Elements**: Makes disabled elements editable.
- **Unlimited MaxLength**: Removes character limits in input fields.
- **Disable Loader**: Hides loading animations or overlays. (Specific for Vanrise)
- **Toggle Design Mode**: Switches design mode on/off for editing page content.
- **Clear Cache**: Clears the browser cache and reloads the active tab.
- **Take Screenshot**: Captures and saves the visible part of the active tab as an image.
- **Make Page Full Screen**: Expands the active tab's webpage to full screen mode.
- **Reveal Passwords**: Converts password fields to text for easy viewing.
- **Change Font**: Changes the font of the webpage content (except for code sections).

### Context Menu (Text Actions - Beta):
- **Highlight Text**: Highlights the selected text.
- **Sentence case**: Converts the selected text to sentence case.
- **lower case**: Converts the selected text to lowercase.
- **UPPER CASE**: Converts the selected text to uppercase.
- **Capitalized Case**: Converts the selected text to capitalized case.
- **altErNaTiNg CASE**: Converts the selected text to alternating case.
- **InVeRsE CaSe**: Inverts the case of the selected text.
- **Title Case**: Converts the selected text to title case.
- **Slugify**: Converts the selected text to a URL-friendly slug.

---

### **User API Setup for Quote**

To enable the **Programming Quote of the Day** feature, you will need to add your own API key:

1. Locate the `user_api.json` file in your local project folder.
2. Open the file and replace `"YOUR_OWN_API_KEY_HERE"` with your personal GEMINI API key (this key should be obtained from Google AI Studio).
3. Save the file.

**Important:** This file is local to your machine. Make sure to enter your own API key in the `"YOUR_OWN_API_KEY_HERE"` spot. Once set, the extension will fetch daily quotes from the API. If there is an issue with the API or key, the extension will fall back to a default static quote.

---

## **File Structure**

```
CodeSavvy/
├── popup.html        # The extension's HTML interface
├── popup.js          # Main JavaScript for handling functionality
├── apiService.js     # JavaScript file handling API service and quote fetching
├── background.js     # Background script for context menu and text actions
├── manifest.json     # Metadata and permissions for the extension
├── Icons/            # Folder containing icons used in the UI
│   ├── icon.png
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon-body.png
│   ├── loader.png
│   ├── switch-off-icon.png
│   ├── switch-on-icon.png
│   ├── clearCache.png
│   ├── fullScreen.png
│   ├── screenshot.png
│   └── revealPasswords.png
├── user_api.json     # JSON file where you add your GEMINI_API_KEY
└── README.md         # Documentation for the extension
```

---

## **Permissions**

The extension requires the following Chrome permissions:
- `activeTab`: To access the active tab's DOM and perform actions.
- `scripting`: To inject scripts into the active tab.
- `browsingData`: To clear cache.
- `contextMenus`: To create context menu items for text actions.
- `storage`: To store extension settings and preferences.
- `tabs`: To interact with browser tabs.

---

## **Contributing**

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Submit a pull request.

---

### **License**  
This project does not currently have a license. All rights are reserved by the author.

---

### **Contact**  
For inquiries or feedback, contact me on my email **[here](mailto:mahdialaaaldin+codesavvy@gmail.com)**.
