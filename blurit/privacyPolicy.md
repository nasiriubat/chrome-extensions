# Privacy Policy for Blur-It Chrome Extension

**Effective Date:** December 3, 2025

**Last Updated:** December 3, 2025

---

## 1. Introduction

Blur-It ("the Extension") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we handle data when you use our Chrome extension.

---

## 2. Information We Do NOT Collect

**Blur-It does not collect, store, transmit, or share any personal or sensitive user data.** Specifically:

- We do not collect your browsing history
- We do not collect passwords, API keys, tokens, or credentials
- We do not collect your name, email address, or location
- We do not track which websites you visit
- We do not create user accounts or require login credentials
- We do not use cookies or web beacons
- We do not sell or share any user data with third parties

---

## 3. How the Extension Works

Blur-It operates entirely locally on your device:

1. **Blur Processing:** When you activate the extension, it applies CSS blur effects to elements containing sensitive credentials on the current active web page
2. **Local Storage:** User preferences (blur settings, custom patterns, whitelisted domains) are stored **only on your local device** using browser storage
3. **No Data Transmission:** Your data is never sent to our servers or any third-party services
4. **No Remote Access:** The extension does not make requests to external servers for processing or data collection

---

## 4. Permissions Explanation

Blur-It requests the following permissions in Chrome. Here's why each is necessary:

### 4.1 `activeTab` Permission
- **Purpose:** Allows the extension to access and blur sensitive data only on the current active tab when you activate it
- **Use:** Without this, the extension cannot identify credentials on your active page
- **Data Handling:** No data is collected or stored; the permission is used only for real-time processing

### 4.2 `host_permissions` (Your specific domains or `<all_urls>`)
- **Purpose:** Enables the extension to inject content scripts that scan and blur sensitive credentials across web pages
- **Use:** Allows the extension to detect password fields, API key patterns, token formats, and other sensitive information
- **Data Handling:** Content remains on your device; nothing is transmitted externally

### 4.3 `storage` Permission
- **Purpose:** Stores user preferences locally on your device, such as:
  - Blur intensity settings
  - Custom credential patterns you define
  - Whitelisted domains (where blur is disabled)
  - Extension toggle state
- **Use:** Ensures your settings persist between sessions
- **Data Handling:** All data stored locally; never shared or transmitted

### 4.4 `scripting` Permission (if applicable)
- **Purpose:** Allows the extension to execute blur logic on web pages
- **Use:** Applies CSS filters and DOM manipulation to hide sensitive information
- **Data Handling:** No data collection; purely visual modification

---

## 5. Local Data Storage

Any data stored by Blur-It is saved **exclusively** on your local device using Chrome's `storage` API:

- **Storage Location:** Your computer's local storage (managed by Chrome)
- **Data Types:** User preferences, blur settings, domain whitelists
- **Retention:** Data persists until you manually clear extension data or uninstall the extension
- **Deletion:** You can clear all extension data anytime by:
  1. Going to `chrome://extensions/`
  2. Clicking **Details** on Blur-It
  3. Selecting **Clear data** (or uninstall the extension)

---

## 6. Third-Party Services

Blur-It **does not integrate with or send data to any third-party services**, including:

- Analytics platforms
- Advertising networks
- Cloud storage services
- Data brokers
- Marketing platforms

---

## 7. Security

Since Blur-It does not collect or transmit personal data, there is minimal security risk. However:

- The extension operates in a restricted sandbox environment (Chrome's security model)
- The extension runs with limited, explicitly requested permissions
- No external network requests are made to transmit data
- Your browser handles all security and encryption

---

## 8. User Rights

You have complete control over Blur-It:

- **Disable:** You can turn off the extension anytime in `chrome://extensions/`
- **Uninstall:** You can remove the extension completely, which deletes all stored data
- **Clear Data:** You can manually clear extension storage without uninstalling
- **Settings:** You can modify blur patterns, whitelisted domains, and other preferences within the extension

---

## 9. Children's Privacy

Blur-It is not intended for users under 13 years of age. We do not knowingly collect information from children. If we become aware that a child has provided us with information, we will delete such information immediately.

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify users of any material changes by updating the "Last Updated" date above.

Your continued use of Blur-It after changes become effective constitutes your acceptance of the updated Privacy Policy.

---

## 11. Contact Us

If you have questions about this Privacy Policy or our privacy practices, please contact us:

**Email:** [your-email@example.com]  
**GitHub:** [your-github-profile-if-applicable]  
**Website:** [your-website-if-applicable]

---

## 12. Compliance

Blur-It complies with:

- **Chrome Web Store Developer Program Policies** regarding user data privacy and secure handling
- **GDPR (General Data Protection Regulation)** – as no personal data is collected, processing, or transmitted
- **CCPA (California Consumer Privacy Act)** – as no personal data is sold or shared
- **NY SHIELD Act** – as no personal data is collected

---

## 13. Policy Summary

| Aspect | Status |
|--------|--------|
| Personal Data Collection | ❌ None |
| Data Transmission | ❌ None |
| Third-Party Sharing | ❌ None |
| Cookies/Trackers | ❌ None |
| Local Storage | ✅ User preferences only |
| Data Retention | ✅ Until uninstall or manual deletion |
| User Control | ✅ Full control (disable, uninstall, clear data) |

---

**Blur-It prioritizes your privacy and security. Your data remains yours, always on your device.**