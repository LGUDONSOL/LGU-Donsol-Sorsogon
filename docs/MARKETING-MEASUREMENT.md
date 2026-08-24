# Donsol Tourism marketing measurement plan

This plan defines what the tourism website should measure without activating advertising trackers or collecting unnecessary personal information. No analytics script should be added until the Municipal Government approves the platform, privacy controls, responsible personnel, and retention period.

## Marketing objectives

1. Help more people discover Donsol through non-paid search and official social campaigns.
2. Move visitors from inspiration to useful planning information.
3. Make the Donsol Tourism Office easy to contact without turning the government website into a booking platform.
4. Identify missing, outdated, or confusing visitor information.
5. Measure interest in experiences while maintaining neutral treatment of businesses and operators.

## Initial setup requiring municipal access

- Verify `https://www.donsol.gov.ph/` in Google Search Console using an approved DNS or HTML verification method.
- Submit `https://www.donsol.gov.ph/sitemap.xml` after the new release is public.
- Select a municipality-approved, privacy-reviewed analytics platform.
- Record the analytics controller, authorized users, retention period, processor, hosting location, cookie behavior, and deletion procedure.
- Update the Privacy Notice and consent mechanism before enabling any technology that stores non-essential cookies or identifiers.

## Recommended non-personal events

| Event | When it occurs | Allowed properties |
| --- | --- | --- |
| `guide_view` | A destination guide is opened | `guide_name`, `source_page` |
| `tourism_contact_click` | Email, telephone, Messenger, or SMS is selected | `channel`, `page` |
| `directions_click` | Tourism Office directions are opened | `page` |
| `directory_contact_click` | A listed establishment contact link is selected | `listing_type`, `listing_name` |
| `media_play` | A visitor starts a promotional video | `media_name`, `page` |
| `official_updates_click` | The official tourism social page is opened | `page` |

Do not record names, phone numbers, email addresses, message text, precise location, government identifiers, health information, payment details, or values typed into a form.

The current release includes declarative `data-marketing-event` markers on the main guide links and destination-page contact actions. They do not transmit or store anything. An approved future measurement integration may listen for these markers instead of changing visitor-facing content.

## Campaign link standard

Use consistent campaign parameters when the Tourism Office shares website links:

- `utm_source`: platform or partner, such as `facebook`, `instagram`, `dot`, or `partner`
- `utm_medium`: `social`, `referral`, `email`, `qr`, or `print`
- `utm_campaign`: lowercase campaign name and period, such as `butanding_2027_launch`
- `utm_content`: optional creative identifier, such as `river_video_01`

Example:

`https://www.donsol.gov.ph/whale-sharks.html?utm_source=facebook&utm_medium=social&utm_campaign=butanding_2027_launch&utm_content=wildlife_card_01`

Campaign names must not contain visitor names or other personal information.

## Monthly dashboard

Review these measures together rather than chasing page views alone:

- Search impressions, clicks, click-through rate, and the queries that lead to official Donsol pages
- Most visited destination guides and travel-planning sections
- Tourism Office contact and directions selections
- Accommodation, food, and local-product directory interactions
- Campaign traffic by approved source and campaign
- Mobile performance and accessibility errors
- Broken external media or business links
- Visitor feedback themes and unresolved content corrections

## Activation approval record

Before adding any analytics code, record:

- Search Console verification method and account owner
- Approved analytics platform and site identifier
- Privacy or Data Protection Officer approval
- Cookie and consent decision
- Data-retention period
- Authorized dashboard users
- Named Tourism Office owner for monthly reporting

Until these items are complete, the website should remain free of analytics and advertising scripts.
