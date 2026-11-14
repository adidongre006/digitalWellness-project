# Audience Profile

## Target audience

University and college students (approximately ages 18–25), using a mix of Android and iOS
phones and Windows, macOS, or occasionally Linux laptops, who are looking for practical,
low-cost ways to manage their digital habits — not a clinical intervention.

## A note on methodology

**This document clearly separates two kinds of claims:**

- **Proposed assumptions** — reasoning based on widely reported, general patterns in published
  research and journalism about student digital-habit concerns (screen time, sleep,
  concentration, and privacy worries are consistently among the most commonly cited digital
  wellbeing concerns in that literature).
- **Actual survey findings** — data this project collected directly, if any.

**Status: no original survey has been conducted for this project.** The "common problems"
and "user needs" below are therefore *proposed assumptions*, used to justify the four problem
categories the assessment offers, not findings from primary research. If this project is
extended with a real student survey (see `docs/USER_FEEDBACK.md` for the template to use),
replace this section with actual results and update this methodology note accordingly — do not
present assumptions as findings.

## Relevant student demographics (assumed, not surveyed)

- Primarily full-time students living on or near campus, with a mix of institution-owned and
  personally-owned devices.
- Budget-constrained — free and freemium tools are generally preferred over paid subscriptions.
- High smartphone dependency for both academic (email, learning platforms) and social use,
  which makes device-level, rather than only browser-level, tools relevant.

## Common digital wellness problems (the four addressed by this platform)

1. **Doomscrolling / excessive social media use** — the most frequently cited concern in
   general student digital-wellbeing discourse, addressed by both screen-time tools (Google
   Digital Wellbeing, Apple Screen Time, StayFree) and focus/blocking tools (Freedom, Cold
   Turkey, LeechBlock NG).
2. **Poor sleep from device use** — addressed by Android Bedtime Mode and Apple Sleep Focus.
3. **Trouble concentrating while studying** — addressed by the focus category.
4. **Online privacy and tracking concerns** — addressed by uBlock Origin and Privacy Badger.

## Identified user needs driving design decisions

| Need | Design decision |
|---|---|
| "I don't know if this app actually works on my phone." | Every resource lists exact supported platforms; the assessment filters by device and shows incompatibilities explicitly rather than hiding them. |
| "I don't want to pay for something that should be free." | Pricing is a mandatory, standardized field (Free / Freemium / Paid / Open Source) on every resource, never left ambiguous. |
| "I don't trust that an app won't just sell my data." | A dedicated Privacy section on every resource page, written to not assume free or open-source implies privacy-safe. |
| "I want to actually set this up, not just read about it." | Three full setup guides with numbered steps and troubleshooting, not just links. |
| "I don't want a chatbot that makes things up." | The AI assistant is constrained (system prompt + grounded catalog) to recommend only from the verified ten-resource catalog. |

## What this project does **not** claim

This platform does not claim to diagnose, treat, or cure any sleep disorder, anxiety,
depression, or behavioral addiction. Where a student's described situation sounds like it may
need professional support, both the chatbot and the project's general guidance point toward a
doctor, counselor, or university health services rather than attempting to address it with a
screen-time tool.
