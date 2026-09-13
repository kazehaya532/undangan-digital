# Design

<!-- impeccable:design-schema 1 -->

## Visual World

The invitation follows the reference-style digital invitation sequence from `ws02`: a locked opening cover, unified couple introduction with one shared portrait, event cards followed by a save-the-date countdown, five-photo portrait slider, portrait slideshows behind the quote and closing, image-backed wishes, gift/amplop section, and fixed bottom navigation after opening. It keeps the approved plum/lavender/denim/blue/white palette rather than copying the reference palette.

## Palette

The palette is white, lavender paper, deep denim ink, plum, and clear blue. White and lavender carry the invitation canvas and cover atmosphere, denim carries primary readability and dark sections, plum marks ceremony/focus/action contrast, and blue adds cool depth to ornamental and placeholder image fields.

## Typography

Heading and couple-name display type uses Marcellus for clear mobile readability in Fahrur and Aurum. Bodoni Moda remains reserved for the Q.S. Ar-Rum quote. Amiri renders the opening Bismillah in plum with generous line-height so Arabic diacritics are never clipped on either mobile or desktop. Interface, logistics, schedule notes, actions, and bold countdown numerals use Manrope for clean mobile legibility. Numerals in schedules and countdowns use tabular treatment where timing matters.

## Components

The first viewport is a full-screen invitation cover with “The Wedding Of,” Fahrur & Aurum, the Indonesian date, a query-parameter-aware guest-recipient card, and a dominant `Buka Undangan` action. A supplied recipient replaces the generic salutation while the fallback remains intact for unpersonalized links. Later sections remain hidden and inert until opened, and opening lands directly on a unified “Wedding Couple” section with one real shared 4:5 portrait, the Arabic Bismillah and Islamic greeting, introductory copy, confirmed full names with Fahrur’s card listed first, and confirmed parent details. The opening gesture also starts licensed cheerful piano music, exposed as a stacked cluster with a play/pause button and a sibling info button that reveals a compact credit popover; the closing section stays purely ceremonial. Event details use stacked ceremonial cards followed by the save-the-date countdown. The gallery uses five real, manually controlled 4:5 portraits over a softly blurred section-wide portrait backdrop with restrained zoom. Q.S. Ar-Rum and the closing each reuse three gallery portraits in automatic slideshows beneath stationary, readable text; the closing repeats the opening's three-line name treatment at 80% scale. Selecting Wish begins at Q.S. Ar-Rum before continuing into the form. Wish and gift sections are included like the reference, with the wish form storing pending messages in Supabase for manual approval and two confirmed bank accounts revealed on request.

## Interaction And Motion

The cover is visible by default and uses a staged title, date, guest card, and action entrance before `Buka Undangan` reveals the remaining content and starts the background music at 40% volume. Recipient parameters (`to`, `kepada`, `for`, or `u`) are normalized and inserted with `textContent`; a supplied name hides the generic `Tamu Undangan` fallback. Music loops continuously, pauses while the document is hidden, resumes only when the guest did not pause it manually, and remains available through a compact icon control above the bottom navigation. The adjacent info button toggles a short credit popover anchored above the cluster; it opens and closes on button press, dismisses on Escape and outside taps, and keeps keyboard focus flowing through the disclosure pattern. Each invitation section then unfolds whenever it re-enters the viewport: headings reveal through a vertical crop, the couple portrait opens through a top-down mask, event cards enter from opposing sides, countdown units rise in sequence, and supporting copy and controls follow in a short ordered sequence. Buttons use pointer-aware hover and touch feedback, the countdown updates once per second without live announcements, gallery slides switch on command, the gallery backdrop slowly zooms only while visible, and the Q.S. Ar-Rum and closing portraits move automatically in opposite horizontal directions. Automatic slideshows pause offscreen, while the document is hidden, or on user request through a compact icon control; reduced-motion users receive immediately visible static content. Gift accounts and newly submitted wishes use short state-change entrances, and the bottom nav marks the currently viewed section.

## Responsiveness

Desktop uses a wider web canvas while portrait media remains intentionally constrained and centered rather than stretched into landscape crops. Mobile remains portrait-first with safe-area-aware bottom navigation and music control, touch-friendly buttons, stacked cards, dynamic viewport sizing, fixed-navigation clearance, and a two-column countdown when space is tight. Short landscape WebViews keep the gated cover vertically scrollable. Mobile reveals avoid expensive entrance blur while preserving the same cinematic rhythm. The Android/mobile portrait view is treated as a primary shipped class, not a fallback.

## Content Policy

The couple names are Fahrur Rozi, S.T and Aurum Khoirunnisa, S.T, presented as "Fahrur & Aurum" across every user-facing name pair. The Wedding Couple person cards list Fahrur first, matching the display order. Parent details and BCA/BNI gift accounts are confirmed (BCA a.n. Fahrur, BNI a.n. Aurum). The event date is Minggu, 6 Desember 2026; Akad begins at 09.00 WIB and the reception begins at 10.00, both at Griya Curug Blok D5 No.23. The seated blue-outfit couple portrait and five gallery portraits are real. Gallery order is IMG_9328, IMG_9346, IMG_9259, IMG_9288, and IMG_9297; three gallery portraits are reused for Q.S. Ar-Rum and three for the closing. The venue and Google Maps link are confirmed. Positional photo descriptions that reference who is where in the frame retain their original wording.

## Accessibility

The page includes a skip link, semantic landmarks and headings, visible focus rings, sufficient text contrast by design intent, text-equivalent actions, reduced-motion handling, and accessible labels for the map action, countdown updates, slideshow state, and actual music playback state.
