"use strict";

// Office URI schemes ("Open in desktop app" links), per Microsoft's
// "Office URI Schemes" spec:
//   ms-word:ofe|u|https://contoso.sharepoint.com/Shared%20Documents/a.docx
//   ms-excel:ofv|u|https://...           (ofv = view, ofe = edit)
//   ms-powerpoint:nft|u|<template>|s|<save folder>   (new from template)
//   ms-word:https://...                  (abbreviated form, means ofe)
// Linux has no Office desktop app, so the document opens in Office on the
// web instead: in an app window, or in the system browser.

const OFFICE_SCHEMES = Object.freeze(["ms-word", "ms-excel", "ms-powerpoint", "ms-visio", "ms-access", "ms-project", "ms-publisher", "ms-infopath"]);
const COMMANDS = new Set(["ofv", "ofe", "nft"]);

const OFFICE_OPTIONS = Object.freeze({
  "officeLinks.openIn": {
    type: "string",
    default: "app",
    enum: ["app", "browser"],
    describe: "Where Office documents open: an app window, or the system browser",
  },
});

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/**
 * @returns {{ scheme: string, command: "ofv"|"ofe"|"nft", url: URL, saveFolder: URL|null }}
 */
function parseOfficeUri(value) {
  const m = /^([a-z-]+):(.*)$/is.exec(typeof value === "string" ? value : "");
  if (!m || !OFFICE_SCHEMES.includes(m[1].toLowerCase())) throw new Error("Not an Office URI");
  const scheme = m[1].toLowerCase();
  const rest = m[2];
  const parts = rest.split("|");
  let command = "ofe";
  let docUrl = rest;
  let saveFolder = null;
  if (COMMANDS.has(parts[0].toLowerCase()) && parts.length >= 3) {
    command = parts[0].toLowerCase();
    const fields = {};
    for (let i = 1; i + 1 < parts.length; i += 2) fields[parts[i].toLowerCase()] = parts[i + 1];
    docUrl = fields.u ?? "";
    saveFolder = fields.s ? httpsUrl(fields.s) : null;
  }
  const url = httpsUrl(docUrl);
  if (!url) throw new Error("Office URI has no https document URL");
  return { scheme, command, url, saveFolder };
}

/**
 * Office on the web URL for a document. SharePoint and OneDrive for work
 * open a document in the browser with ?web=1. Other hosts (e.g. personal
 * d.docs.live.net WebDAV URLs) are returned unchanged.
 */
function webUrlFor(parsed) {
  const url = new URL(parsed.url.href);
  if (url.hostname.endsWith(".sharepoint.com") && parsed.command !== "nft") url.searchParams.set("web", "1");
  return url.href;
}

/** True for Office on the web document pages (Word, Excel, PowerPoint editors and viewers). */
function isOfficeDocumentUrl(value) {
  const url = httpsUrl(value);
  if (!url) return false;
  const host = url.hostname;
  if (host.endsWith(".officeapps.live.com")) return true;
  // SharePoint/OneDrive for work open documents at /:w:/, /:x:/, /:p:/ or /_layouts/15/Doc.aspx.
  return host.endsWith(".sharepoint.com") && (/^\/:[wxpbv]:\//.test(url.pathname) || /\/_layouts\/15\/(Doc|WopiFrame)\.aspx$/i.test(url.pathname));
}

/** Window-open override: send Office documents to the browser when configured. */
function routeOfficeWindow(url, _kind, ctx) {
  if (ctx.flat["officeLinks.openIn"] !== "browser") return null;
  return isOfficeDocumentUrl(url) ? "external" : null;
}

function officeProtocols() {
  return OFFICE_SCHEMES.map((scheme) => ({
    scheme,
    toUrl: (value, ctx) => ({
      url: webUrlFor(parseOfficeUri(value)),
      external: ctx.flat["officeLinks.openIn"] === "browser",
    }),
  }));
}

module.exports = { OFFICE_SCHEMES, OFFICE_OPTIONS, parseOfficeUri, webUrlFor, isOfficeDocumentUrl, routeOfficeWindow, officeProtocols };
