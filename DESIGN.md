# Design

<!-- impeccable:design-schema 1 -->

## Visual World

The invitation follows the reference-style digital invitation sequence from `ws02`: a locked opening cover, unified couple introduction with one shared portrait, event cards followed by a save-the-date countdown, five-photo portrait slider, portrait slideshows behind the quote and closing, image-backed wishes, gift/amplop section, and fixed bottom navigation after opening. It keeps the approved plum/lavender/denim/blue/white palette rather than copying the reference palette.

## Palette

The palette is white, lavender paper, deep denim ink, plum, and clear blue. White and lavender carry the invitation canvas and cover atmosphere, denim carries primary readability and dark sections, plum marks ceremony/focus/action contrast, and blue adds cool depth to ornamental and placeholder image fields.

## Typography

Heading and couple-name display type uses Marcellus for clear mobile readability in Aurum and Fahrur. Bodoni Moda remains reserved for the Q.S. Ar-Rum quote. Interface, logistics, schedule notes, actions, and bold countdown numerals use Manrope for clean mobile legibility. Numerals in schedules and countdowns use tabular treatment where timing matters.

## Components

The first viewport is a full-screen invitation cover with “The Wedding Of,” Aurum & Fahrur, the Indonesian date, a guest-recipient card, and a dominant `Buka Undangan` action. Later sections remain hidden and inert until opened, and opening lands directly on a unified “Wedding Couple” section with one real shared 4:5 portrait, introductory copy, confirmed full names, and confirmed parent details. Event details use stacked ceremonial cards followed by the save-the-date countdown. The gallery uses five real, manually controlled 4:5 portraits over a softly blurred section-wide portrait backdrop with restrained zoom. Q.S. Ar-Rum and the closing each reuse three gallery portraits in automatic slideshows beneath stationary, readable text; the closing repeats the opening's three-line name treatment at 80% scale. Selecting Wish begins at Q.S. Ar-Rum before continuing into the form. Wish and gift sections are included like the reference, with the wish form stored only in the current browser session and two confirmed bank accounts revealed on request.

## Interaction And Motion

The cover is visible by default and the invitation content becomes visible only after `Buka Undangan`. Each invitation section then unfolds whenever it re-enters the viewport: headings reveal through a vertical crop, focal media opens through a softened veil, and supporting copy and controls follow in a short ordered sequence. Buttons lift on hover, the countdown updates once per second without live announcements, gallery slides switch on command, the gallery backdrop slowly zooms only while visible, and the Q.S. Ar-Rum and closing portraits move automatically in opposite horizontal directions. Automatic slideshows pause offscreen, while the document is hidden, or on user request through a compact icon control; reduced-motion users receive immediately visible static content. Gift accounts and newly submitted wishes use short state-change entrances, and the bottom nav marks the currently viewed section.

## Responsiveness

Desktop uses a wider web canvas while portrait media remains intentionally constrained and centered rather than stretched into landscape crops. Mobile remains portrait-first with bottom navigation, touch-friendly buttons, stacked cards, and a two-column countdown when space is tight. The Android/mobile portrait view is treated as a primary shipped class, not a fallback.

## Content Policy

The couple names are Aurum Khoirunnisa, S.T and Fahrur Rozi, S.T, with confirmed parent details and BCA/BNI gift accounts. The event date is Minggu, 6 Desember 2026; Akad begins at 09.00 WIB and the reception begins at 10.00, both at Griya Curug Blok D5 No.23. The shared couple portrait and five gallery portraits are real, three gallery portraits are reused for Q.S. Ar-Rum, and three are reused for the closing. The venue and Google Maps link are confirmed.

## Accessibility

The page includes a skip link, semantic landmarks and headings, visible focus rings, sufficient text contrast by design intent, text-equivalent actions, reduced-motion handling, and accessible labels for the map action and countdown updates.
