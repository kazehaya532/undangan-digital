# **Digital Wedding Invitation**

Static digital wedding invitation

## Preview Locally

```bash
npm run start
```

## Check

```bash
npm run check
```

## Structure

- `index.html` - GitHub Pages entry page
- `assets/css/styles.css` - visual system and responsive layout
- `assets/js/script.js` - countdown, invitation gate, replayable section transitions, photo sliders, wish form, gift reveal, and navigation state
- `assets/images/` - optimized images published with the invitation
- `assets/audio/` - optimized, attributed background music published with the invitation
- `wedd_picture/` - ignored local source photography; never published to GitHub
- `PRODUCT.md` - product context
- `DESIGN.md` - design system notes
- `THIRD_PARTY_NOTICES.md` - third-party asset provenance and license terms

## Invitation Content

The couple details are set to Aurum Khoirunnisa, S.T and Fahrur Rozi, S.T. Akad and the reception take place at Griya Curug Blok D5 No.23 on Minggu, 6 Desember 2026. Akad begins at 09.00 WIB and the reception begins at 10.00.

The venue, map link, parent details, and BCA/BNI gift accounts are confirmed. The seated blue-outfit Wedding Couple portrait and five gallery portraits are optimized derivatives; their originals remain local under the ignored `wedd_picture/` folder. Gallery order is `IMG_9328`, `IMG_9346`, `IMG_9259`, `IMG_9288`, and `IMG_9297`. Three gallery portraits are reused by Q.S. Ar-Rum, and three are reused by the closing slideshow.

For a cinematic portrait slide, add `has-photo`, set `--portrait-image` to the same image URL relative to `assets/css/styles.css` (for example, `url('../images/photo.jpg')`), and place the portrait in an `img` element inside the slide. The component keeps the portrait sharp while using a softly blurred, slowly zooming copy behind it. Reduced-motion preferences disable the zoom.

## Background Music

Opening the invitation starts `There is Romance` by Kevin MacLeod at 35% volume. The track loops while the invitation is open, pauses while the page is hidden, and can be paused or resumed with the fixed music control. A sibling info button reveals a compact credit popover with the source and license; full provenance and encoding details live in `THIRD_PARTY_NOTICES.md`.
