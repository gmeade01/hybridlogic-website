# BU-01: Starling Quantitative (HybridLogicWebsite) — Biwada Operating Context (`AGENTS.md`)

- **Parent Entity:** `Biwada LLC` | **Portfolio Tier:** Tier 1 (`bu01_starling`)
- **DBA Brand:** `Starling Quantitative` | **Domains:** `starlingquant.com, starlingquantitative.com`
- **Live URL:** `https://starlingquant.web.app`

## Shared Zero-Cost Biwada Substrate (Do Not Reinvent)
- **24/7 Edge Nerve Center (`$0/mo` Workers + D1 SQLite):** `https://api.biwada.com`
  - Lead / Waitlist Capture (`D1` + Telegram ping): `POST https://api.biwada.com/launchpad` (`C:\Hybrid Logic\HL Business Operations\substrate\launchpad_client.js`)
  - Cookie-Free Funnel Telemetry (`D1`): `POST https://api.biwada.com/event` (`trackEvent()`)
  - Signed Stripe Webhooks & 2-Way Telegram Bot: `https://api.biwada.com/stripe-webhook`
- **Shared Ops Modules:** `C:\Hybrid Logic\HL Business Operations\substrate\` (`telegram_mesh`, `stripe_provisioner`, `ai_gateway`, `growth_engine`)
- **Safety & Privacy Guardrails:** Never hardcode secrets or personal operator phone numbers; store local secrets in gitignored `.env` (`gardener vault-sync` backs `.env` files up to GCP Secret Manager).
