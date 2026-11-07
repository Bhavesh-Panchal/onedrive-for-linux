"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProduct, LINK } = require("@ms365-for-linux/core");
const { createLinkClassifier } = require("@ms365-for-linux/core/src/links");
const { parseOfficeUri, webUrlFor, isOfficeDocumentUrl, routeOfficeWindow } = require("../src/office");
const descriptor = require("../src/product");

const product = validateProduct(descriptor);
const classify = createLinkClassifier(product);
const ctx = (openIn = "app") => ({ flat: { "officeLinks.openIn": openIn } });

test("descriptor validates and classifies OneDrive hosts", () => {
  assert.equal(classify("https://contoso-my.sharepoint.com/personal/u/_layouts/15/onedrive.aspx"), LINK.APP);
  assert.equal(classify("https://onedrive.live.com/?id=root"), LINK.APP);
  assert.equal(classify("https://onedrive.cloud.microsoft/_forms/default.aspx"), LINK.APP);
  assert.equal(product.urls.work, "https://onedrive.cloud.microsoft/");
  for (const hub of ["https://www.microsoft365.com/landingv2", "https://m365.cloud.microsoft/chat/", "https://www.office.com/"]) {
    assert.notEqual(classify(hub), LINK.APP, `${hub} is the Copilot hub, not OneDrive`);
  }
  assert.equal(classify("https://word-edit.officeapps.live.com/we/wordeditorframe.aspx"), LINK.CONTENT);
  assert.equal(classify("https://login.live.com/oauth20_authorize.srf"), LINK.AUTH);
  assert.equal(classify("ms-word:ofe|u|https://contoso.sharepoint.com/a.docx"), LINK.PROTOCOL);
  assert.equal(classify("https://www.example.org/"), LINK.EXTERNAL);
  assert.deepEqual(product.unread.sources, []);
});

test("Office URI: full and abbreviated forms", () => {
  const full = parseOfficeUri("ms-excel:ofv|u|https://contoso.sharepoint.com/Shared%20Documents/b.xlsx");
  assert.equal(full.scheme, "ms-excel");
  assert.equal(full.command, "ofv");
  assert.equal(full.url.pathname, "/Shared%20Documents/b.xlsx");
  const short = parseOfficeUri("MS-WORD:https://contoso.sharepoint.com/a.docx");
  assert.equal(short.scheme, "ms-word");
  assert.equal(short.command, "ofe");
  const nft = parseOfficeUri("ms-powerpoint:nft|u|https://contoso.sharepoint.com/t.potx|s|https://contoso.sharepoint.com/Docs");
  assert.equal(nft.command, "nft");
  assert.equal(nft.saveFolder.pathname, "/Docs");
});

test("Office URI: rejects unknown schemes and non-https documents", () => {
  assert.throws(() => parseOfficeUri("ms-foo:ofe|u|https://x/a"), /Not an Office URI/);
  assert.throws(() => parseOfficeUri("ms-word:ofe|u|http://x/a.docx"), /https/);
  assert.throws(() => parseOfficeUri("ms-word:ofe|u|file:///etc/passwd"), /https/);
  assert.throws(() => parseOfficeUri("ms-word:"), /https/);
});

test("Office URI to web URL", () => {
  assert.equal(
    webUrlFor(parseOfficeUri("ms-word:ofe|u|https://contoso.sharepoint.com/a.docx?x=1")),
    "https://contoso.sharepoint.com/a.docx?x=1&web=1",
  );
  assert.equal(webUrlFor(parseOfficeUri("ms-word:ofe|u|https://d.docs.live.net/abc/a.docx")), "https://d.docs.live.net/abc/a.docx");
});

test("protocol handler result honors officeLinks.openIn", () => {
  const word = product.protocols.find((p) => p.scheme === "ms-word");
  const inApp = word.toUrl("ms-word:ofe|u|https://contoso.sharepoint.com/a.docx", ctx("app"));
  assert.equal(inApp.external, false);
  assert.equal(classify(inApp.url), LINK.APP);
  assert.equal(word.toUrl("ms-word:ofe|u|https://contoso.sharepoint.com/a.docx", ctx("browser")).external, true);
});

test("Office document windows route to the browser only when configured", () => {
  const doc = "https://contoso-my.sharepoint.com/:w:/g/personal/u/EabcDEF";
  assert.equal(isOfficeDocumentUrl(doc), true);
  assert.equal(isOfficeDocumentUrl("https://contoso.sharepoint.com/sites/x/_layouts/15/Doc.aspx"), true);
  assert.equal(isOfficeDocumentUrl("https://excel.officeapps.live.com/x/_layouts/xlviewerinternal.aspx"), true);
  assert.equal(isOfficeDocumentUrl("https://contoso-my.sharepoint.com/personal/u/_layouts/15/onedrive.aspx"), false);
  assert.equal(routeOfficeWindow(doc, LINK.APP, ctx("app")), null);
  assert.equal(routeOfficeWindow(doc, LINK.APP, ctx("browser")), "external");
  assert.equal(routeOfficeWindow("https://contoso-my.sharepoint.com/personal/u/", LINK.APP, ctx("browser")), null);
});
