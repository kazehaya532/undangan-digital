# Design

<!-- impeccable:design-schema 1 -->

## Visual World

The invitation follows the reference-style digital invitation sequence from `ws02`: a locked opening cover, intro with two couple-photo placeholders, couple section, countdown, event cards, landscape photo slider, image-backed quote, image-backed wishes, gift/amplop section, image-backed closing, and fixed bottom navigation after opening. It keeps the approved plum/lavender/denim/blue/white palette rather than copying the reference palette.

## Palette

The palette is white, lavender paper, deep denim ink, plum, and clear blue. White and lavender carry the invitation canvas and cover atmosphere, denim carries primary readability and dark sections, plum marks ceremony/focus/action contrast, and blue adds cool depth to ornamental and placeholder image fields.

## Typography

Display type uses Bodoni Moda for high-contrast editorial names and section titles. Interface, logistics, schedule notes, and actions use Manrope for clean mobile legibility. Numerals in schedules and countdowns use tabular treatment where timing matters.

## Components

The first viewport is a full-screen invitation cover with “The Wedding Of,” Aurum & Alul, the Sunday date, a guest-recipient card, and a dominant `Buka Undangan` action. Later sections remain hidden and inert until opened, and opening now lands on the intro photo-template section before the couple names. The pre-couple intro carries two photo templates like the reference, while the couple section itself presents an enlarged “Wedding Couple” heading, individual names, parent placeholders, and generous whitespace without photos. Event details use stacked ceremonial cards. Gallery uses three landscape placeholder slides. The Q.S. Ar-Rum section is a compact landscape background placeholder with smaller scripture text inside a colored panel so the image can dominate. Wish and gift sections are included like the reference, with the wish form stored only in the current browser session and gift accounts clearly placeholder.

## Interaction And Motion

The cover is visible by default and the invitation content becomes visible only after `Buka Undangan`. Motion is limited to purposeful micro-interaction: buttons lift on hover, the countdown updates once per second without live announcements, gallery slides switch on command, gift accounts reveal on demand, wishes insert locally, and the bottom nav marks the currently viewed section. Reduced-motion users receive effectively static transitions.

## Responsiveness

Desktop uses a wider landscape web canvas at large breakpoints so the invitation does not feel like a tiny Android webview preview. Mobile remains portrait-first with bottom navigation, touch-friendly buttons, stacked cards, and a two-column countdown when space is tight. The Android/mobile portrait view is treated as a primary shipped class, not a fallback.

## Content Policy

The couple names are Aurum & Alul and the event date/time is Sunday, 6 December 2026 at 09.00 WIB until selesai. Venue, parent names, portrait photography, gift accounts, and map details remain placeholder content until replaced by real event data.

## Accessibility

The page includes a skip link, semantic landmarks and headings, visible focus rings, sufficient text contrast by design intent, text-equivalent actions, reduced-motion handling, and accessible labels for the map action and countdown updates.
