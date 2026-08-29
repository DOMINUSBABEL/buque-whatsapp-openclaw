# ALARICUS Mobile Screenshot & Visual Outreach Engine

## Overview
Automated generation and multi-channel dispatch of high-resolution mobile website screenshots.

### Technical Highlights:
- **Viewport:** 412x892 (iPhone 14 / Pixel 7 aspect ratio) @ 2x DPI.
- **Rendering:** Headless Chromium with optimized Windows launch arguments.
- **Format:** High-definition `.png` saved to `generated_screenshots/<slug>.png`.
- **Public Serving:** Express static route on `/screenshots/<slug>.png`.
- **Outreach Integration:** Automatically dispatched as an image message with the pitch copy as caption when video is unavailable.
- **Operator Commands:** `!pantallazo [lead_id|slug]` triggers instant image delivery to WhatsApp administrators.
