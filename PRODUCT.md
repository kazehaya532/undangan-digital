# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML, CSS, and vanilla JavaScript because the invitation is an info-only shareable surface that should deploy easily and load quickly without a build step.

## Users

Wedding guests opening a shared digital invitation on mobile first, often from a messaging app, to confirm the event details quickly.

## Product Purpose

The product is a digital wedding invitation that presents the couple, date, venue, schedule, and supporting guest information in a polished web experience. Success means a guest can understand the invitation, save the date, and find the venue without needing a separate PDF or chat follow-up.

## Positioning

The invitation is a crafted ceremonial web object, not a generic event page: it should make the event feel considered while keeping the facts immediately readable.

## Operating Context

Guests may view personalized invitation links on phones in portrait orientation, share them through chat, and revisit the site shortly before the event for time and location details.

## Capabilities and Constraints

The invitation includes a reference-style opening cover personalized by a URL query parameter and opened with `Buka Undangan` before other sections are available, licensed cheerful piano music that begins from that opening gesture and exposes its attribution through a compact info popover on the fixed music control, a unified couple introduction led by the Arabic Bismillah and the Islamic greeting followed by one shared portrait and family details, event information followed by a save-the-date countdown, a five-image portrait photo slider, a Q.S. Ar-Rum slideshow that reuses three gallery portraits, a Supabase-backed moderated wish form, a gift/amplop section, and a closing slideshow that reuses three gallery portraits. Selecting Wish begins at Q.S. Ar-Rum before continuing into the form. Confirmed invitation details include Fahrur Rozi, S.T and Aurum Khoirunnisa, S.T, their parent information, two bank accounts, and Minggu, 6 Desember 2026. Akad begins at 09.00 WIB and the reception begins at 10.00, both at Griya Curug Blok D5 No.23. The seated blue-outfit portrait is dedicated to Wedding Couple; the five-image gallery follows IMG_9328, IMG_9346, IMG_9259, IMG_9288, and IMG_9297. The confirmed map link opens the shared venue. It should work as a static, mobile-WebView-safe website.

## Evidence on Hand

The user provided the couple names and family details, BCA and BNI gift accounts, the event date Minggu, 6 Desember 2026, Akad and reception times, the Griya Curug venue, a Google Maps link, one couple portrait, five gallery portraits, the reference site https://demosdigitalundangan.com/ws02/, and requested a gate-first flow with portrait photography and automatic slideshows. The user also requested that existing Our Moments photography be reused in the closing section, that the couple name be presented as Fahrur & Aurum (groom first), and that the Wedding Couple introduction open with the Arabic Bismillah and the Islamic greeting.

## Product Principles

Make event facts instantly clear.
Treat ceremony and logistics as one coherent experience.
Keep the page lightweight enough for mobile sharing.
Use placeholders honestly where real event details are absent.
