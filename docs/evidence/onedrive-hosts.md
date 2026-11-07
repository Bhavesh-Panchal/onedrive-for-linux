# R3 (in progress): OneDrive on the web hosts and flows

Status: **provisional**. Signed-out observations on 2026-11-07, from `curl -L` redirect
chains and the onedrive-for-linux shell with Electron navigation tracing and a
screenshot (not REA). The signed-in REA capture with your accounts will replace this.

## Start URLs

| URL | Signed-out result | Used as |
|---|---|---|
| `https://onedrive.live.com/` | → `www.microsoft.com/…/onedrive/online-cloud-storage` (marketing) | not used |
| `https://onedrive.live.com/login/` | stays; Microsoft account sign-in form (in a frame) | **personal** |
| `https://www.microsoft365.com/onedrive` | → work sign-in; `redirect_uri` = `www.microsoft365.com/landingv2` | **not used**: after sign-in opens the Microsoft 365 Copilot hub, not OneDrive (reported by user signed in, 2026-11-07) |
| `https://www.office.com/onedrive` | → same work sign-in | not used (same hub) |
| `https://portal.office.com/onedrive` | → `login.microsoftonline.com/common/oauth2/authorize` (v1); `redirect_uri` = `portal.office.com/landing` | not used (hub) |
| `https://onedrive.cloud.microsoft/` | → `login.microsoftonline.com/common/oauth2/authorize`; `redirect_uri` = `onedrive.cloud.microsoft/_forms/default.aspx` | **work** (since 0.1.1) |

After work sign-in OneDrive is expected to move to the tenant host
`<tenant>-my.sharepoint.com`; this is why `*.sharepoint.com` is an app host for
OneDrive (it is only a content host for Outlook).

## Office links

`ms-word:ofe|u|<https url>` launch: the shell converted it to
`<url>?web=1` and loaded it in the main window (checked with a non-existent tenant,
so the load ended on the offline page with `ERR_NAME_NOT_RESOLVED`).

## To confirm signed in

- Tenant host after work sign-in, and whether `www.microsoft365.com` stays in the frame chain.
- Hosts used by downloads (expected `*.files.1drv.com`, `*.livefilestore.com`, `*.sharepoint.com`).
- How "Open" on a Word/Excel/PowerPoint file opens: same window, `window.open`, or an `ms-*:` link.
- Upload by drag and drop and by file picker.
- Photos (`photos.onedrive.com`) and shared-with-me views.
