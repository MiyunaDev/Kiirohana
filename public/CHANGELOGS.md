# Changelogs

## 0.0.2 - 0.0.5 (Shinobu Base System)

### Major Updates

**System & Infrastructure**

* **Multi-Platform & Architecture Support:** Implemented broad architecture support including 32-bit, ARM, and ARMV7L. Set macOS build configuration to Universal.
* **Stack Modernization:** Migrated and updated Node.js, Java, JDK, and Android SDK to higher versions to improve performance and compatibility.
* **CI/CD Automation:** Implemented an automated release system via GitHub Workflows, integrated Dependabot auto-merge, and established a Telegram bot for automated build uploads with a 50MB limit.

**Application Features & Modules**

* **Shinobu Module:** Completed all core features for the Shinobu system, including the Reader function, Account Change system, and internal Toast notifications.
* **Interaction & Community Systems:** Implemented a full Comment system for the comic reader and a User Level system with level badges integrated into accounts and landing pages.
* **Collection Management:** Launched Library, Bookmark, and Collection features for enhanced user reading list management.
* **Advanced Search:** Implemented a functional Advanced Search system and added a chapter search feature within the Comic Reader.

### Minor Updates & Optimizations

**UI/UX & Visuals**

* **Rebranding:** Updated the application icon, configured visual assets, and adjusted landing page background colors.
* **Navigation:** Overhauled the application's navigation structure and added new pages to support the updated navigation flow.
* **Documentation:** Performed significant updates to the README.md file and included new backend options and detailed project descriptions.

**Technical & Configuration**

* **Cordova & Hybrid Development:** Optimized the Cordova network system, Access Origin policies, and general Cordova preferences.
* **Code Maintenance:** Conducted periodic code refactoring, removed unused variables, and terminated internal extension support to prioritize core stability.
* **Package Management:** Introduced clean install steps in the NPM workflow and removed package-lock.json to prevent version-specific build errors.

### Bug Fixes & Stability

**Platform Specifics**

* **Android:** Corrected icon paths (moved from /res to /android), resolved keystore issues, and fixed missing file errors during the prebuilt setup.
* **Electron (Desktop):** Resolved Snapcraft errors and removed HTTPS intent configurations that caused setup failures on Windows.
* **Web/React:** Fixed build failures in appProds and corrected layout errors in DetailLayout.

**General Fixes**

* **Comic Reader:** Resolved a double-content display bug within the reader module.
* **Workflow:** Fixed various workflow file errors (notably error 218 and 232) and addressed "artifact not found" issues.
* **Windows Environment:** Addressed internal noise issues and fixed file ignore rules for elevate.exe.

### Version Summary

* **v0.0.2 - v0.0.3:** Initial foundation phase, GitHub Actions setup, and Shinobu module initiation.
* **v0.0.4:** Focused on navigation stability, search functionality, and service management configuration.
* **v0.0.5:** Introduced community features (comments/levels), Library management, and major multi-architecture build system updates.

## 0.0.1

### Universal
- Add libary system
- Add country flag for spesific language `INDONESIA`, `ENGLISH` (US)
- Add changelog system
- Add navigation system

### Android
- Add icon for android app

### Desktop
- Add icon for desktop app