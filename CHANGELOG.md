# Changelog

## 0.3.0 (2026-11-07)

### Features

* **auth:** sign-in dialog when a proxy or site asks for a user name and password (Basic, NTLM, Negotiate)
* **auth:** `auth.basic.user` + `auth.basic.passwordCommand` sign in without the dialog, e.g. from `pass`
* **auth:** PIN dialog for smartcard / PKCS#11 client certificates; pick a certificate with `auth.clientCertificate.issuer` or `.subject`
* **auth:** trust a company CA (TLS-inspecting proxies) with `auth.customCAFingerprints`; the log prints the fingerprint to add
* **control:** system-wide shortcuts with `shortcuts.global` (`show`, `hide`, `toggle`, `reload`, `home`, `quit`)
* **control:** `--action=<name>` controls the running app from scripts
* **control:** opt-in D-Bus interface (`dbus.enabled`): `Run`, `ListActions`, `GetUnreadCount` and an `UnreadChanged` signal
* **updates:** daily check for a newer GitHub release with a notification; *Help › Check for Updates…*

### Documentation

* **readme:** corporate networks, shortcuts and remote control, updates

## 0.2.5 (2026-11-07)

### Features

* **packages:** release RPM, DEB, AppImage and tar.gz for x86_64 and arm64, with `SHA256SUMS` and update metadata (`latest-linux.yml`, `latest-linux-arm64.yml`)
* **readme:** install table for every distribution and architecture

## 0.2.4 (2026-11-07)

### Bug Fixes

* **identity:** report the Google Chrome brand in client hints, so Microsoft shows features it limits to Chrome (`network.browserBrand`, default `chrome`)

## 0.2.3 (2026-11-07)

First public release.

### Features

* **accounts:** work (`onedrive.cloud.microsoft`, which opens your organisation's OneDrive) and personal (`onedrive.live.com`) accounts, side by side with profiles
* **office:** `ms-word:`, `ms-excel:`, `ms-powerpoint:` and other Office links open in Office on the web (`officeLinks.openIn`: `app` or `browser`)
* **downloads:** progress on the taskbar and a notification when done
* **menu:** tray and app menu in the style of Teams for Linux: theme (system/light/dark), zoom, app icon, *Quit (Clear Storage)*
* **icons:** app icon in the Teams for Linux style, with the Linux penguin

### Bug Fixes

* **start page:** work accounts open OneDrive, not the Microsoft 365 Copilot home page
* **text:** grayscale antialiasing by default, so text matches Firefox instead of looking bold
