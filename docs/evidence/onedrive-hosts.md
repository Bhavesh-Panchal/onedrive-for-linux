# R3: OneDrive on the web hosts and flows

Status: **signed-in observation done** (work account, 2026-11-07), same method as R2
(Electron observer with the user's profile; hostnames, outcomes, frames and permissions only).

## Signed-in result

| Check | Result |
|---|---|
| Page after start | `<tenant>-my.sharepoint.com/personal/…` ("Home - OneDrive"): the start URL `onedrive.cloud.microsoft` reaches OneDrive, not the Copilot hub |
| Failed requests | none |
| Blocked navigations, popups | none |
| Frames | `webshell.suite.office.com` (Microsoft 365 header/app launcher), `owl.officeapps.live.com` (Office web loader) |
| Permission denials | `local-network-access` from the tenant SharePoint page (5×), `background-sync` from `webshell.suite.office.com`. No visible effect; kept denied. |

Hosts contacted (all succeeded): tenant `-my.sharepoint.com` and `.sharepoint.com`, `login.microsoftonline.com`,
`graph.microsoft.com`, `webshell.suite.office.com`, `owl.officeapps.live.com`, `res.cdn.office.net`,
`res-1.cdn.office.net`, `res.public.onecdn.static.microsoft`, `ecs.office.com`, `tr-ecs-acdc.office.com`,
`tr-ecs-atm.office.com`, `*.fp.measure.office.com`, `js.monitor.azure.com`, and telemetry hosts
`browser.events.data.microsoft.com`, `browser.pipe.aria.microsoft.com`, `mobile.events.data.microsoft.com`.

## Still open

- Personal account (onedrive.live.com) not observed signed in.
- Opening a Word/Excel document and downloading/uploading a file were not exercised (would change user data).

## Signed-out observations (earlier)

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
