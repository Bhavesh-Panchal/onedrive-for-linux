# OneDrive for Linux

Unofficial desktop client for OneDrive on the web, for Linux. Not affiliated with or endorsed by Microsoft.

<img src="assets/icons/256x256.png" width="96" alt="">

## Features

- Work (`onedrive.cloud.microsoft` → your SharePoint OneDrive) and personal (`onedrive.live.com`) accounts
- `ms-word:`, `ms-excel:`, `ms-powerpoint:` links open in Office on the web (`officeLinks.openIn`: `app` or `browser`)
- Downloads with progress and a notification when done
- Web client only: it does not sync files to disk (use abraunegg/onedrive or rclone for that)
- Tray and app menu in the style of teams-for-linux: theme (system/light/dark), zoom, notifications, app icon, *Quit (Clear Storage)*
- Sandboxed, context-isolated pages; permissions only for Microsoft's own pages
- Offline page with automatic retry

## Install (Fedora)

Download the RPM from Releases, then:

```bash
sudo dnf install ./onedrive-for-linux-*.x86_64.rpm
```

## Build from source

Requires Node.js 22+ and `rpm-build`.

```bash
npm install
npm run check        # lint + unit tests
npm run smoke        # launches the app against a local test page
npm run package:rpm  # dist/onedrive-for-linux/onedrive-for-linux-<version>.x86_64.rpm
```

## Configuration

`~/.config/onedrive-for-linux/config.json` (user) and `/etc/onedrive-for-linux/config.json` (system). Every option can also be given on
the command line, e.g. `onedrive-for-linux --profile=personal --account=personal`. *Settings → Show Active Configuration* lists
the current values.

## Source

This repository is generated from the ms365-for-linux monorepo, which holds both this app and its sibling.
The shared shell is in `core/`. Parts of it are derived from
[teams-for-linux](https://github.com/IsmaelMartinez/teams-for-linux); see `NOTICE.md`.

## License

GPL-3.0-or-later. See `LICENSE`.
