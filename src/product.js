"use strict";

const path = require("node:path");
const { OFFICE_OPTIONS, officeProtocols, routeOfficeWindow } = require("./office");
const pkg = require("../package.json");

const assets = path.join(__dirname, "..", "assets");

// Host lists are provisional until R3 (docs/evidence/onedrive-hosts.md).
// OneDrive for work lives on the tenant's own <tenant>-my.sharepoint.com host,
// so "*.sharepoint.com" is an app host here (it is only content for Outlook).
module.exports = {
  id: "onedrive-for-linux",
  name: "OneDrive for Linux",
  title: "OneDrive",
  description: "Unofficial OneDrive on the web desktop client for Linux (no file sync)",
  version: pkg.version,
  homepage: pkg.homepage,
  bugs: pkg.bugs?.url,
  urls: {
    // OneDrive's own entry point: sign-in returns to onedrive.cloud.microsoft/_forms/default.aspx.
    // Not www.microsoft365.com/onedrive: that returns to /landingv2, the Microsoft 365
    // Copilot hub, not OneDrive (reported 2026-11-07).
    work: "https://onedrive.cloud.microsoft/",
    // onedrive.live.com/ alone lands on the marketing page when signed out.
    personal: "https://onedrive.live.com/login/",
  },
  defaultAccount: "work",
  hosts: {
    // The Microsoft 365 / Copilot hub (www.microsoft365.com, www.office.com,
    // m365.cloud.microsoft) is deliberately not an app host.
    app: ["onedrive.cloud.microsoft", "*.sharepoint.com", "onedrive.live.com", "photos.onedrive.com"],
    content: ["*.officeapps.live.com", "*.cdn.office.net", "*.svc.ms", "*.files.1drv.com", "*.livefilestore.com", "*.onedrive.com"],
  },
  protocols: officeProtocols(),
  routeLink: routeOfficeWindow,
  // OneDrive has no unread count.
  unread: { sources: [] },
  permissions: ["notifications", "clipboard-read", "clipboard-sanitized-write", "fullscreen", "openExternal"],
  icons: {
    app: path.join(assets, "icon.png"),
    tray: path.join(assets, "tray.png"),
    trayUnread: path.join(assets, "tray.png"),
  },
  options: { ...OFFICE_OPTIONS },
  homeLabel: "My files",
  supportUrl: "https://support.microsoft.com/onedrive",
};
