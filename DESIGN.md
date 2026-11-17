---
name: Pitcar Service
description: Livery Malam, a racing-livery world for a car workshop site that ends every action in a prefilled WhatsApp chat.
colors:
  red: "#cc0000"
  red-deep: "#a30000"
  red-ink: "#b80000"
  red-ink-dark: "#ff5247"
  on-red: "#ffffff"
  on-red-2: "#ffe3df"
  signal: "#00705c"
  signal-dark: "#19e6c3"
  signal-fill: "#19e6c3"
  signal-wash: "rgb(0 112 92 / 10%)"
  signal-wash-dark: "rgb(25 230 195 / 12%)"
  on-signal: "#06231d"
  ground: "#f3f3f3"
  ground-dark: "#0f0f10"
  panel: "#fbfbfb"
  panel-dark: "#18181a"
  ink: "#111112"
  ink-dark: "#f3f3f3"
  ink-2: "#4a4c52"
  ink-2-dark: "#a9abb1"
  seam: "rgb(17 17 18 / 18%)"
  seam-dark: "rgb(243 243 243 / 18%)"
  paint-day: "#c9ccd1"
  paint-night: "#30333a"
typography:
  display:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.75rem, 12.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  page-head:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.5rem, 8.5vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.75rem, 4.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.25rem, 2.6vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.1
  numeral:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.5rem, 11vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tabular-nums"
  body:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.6vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
  tag:
    fontFamily: "'Chakra Petch', 'Arial Narrow', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  chip: "2px"
  plate: "3px"
spacing:
  gutter: "clamp(16px, 4vw, 32px)"
  section: "clamp(56px, 9vw, 112px)"
  block: "clamp(24px, 4vw, 40px)"
  row: "20px"
  plate-gap: "8px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.plate}"
    padding: "0.7em 2.6em 0.7em 1.4em"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.red-deep}"
    textColor: "{colors.on-red}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "0.7em 1.4em"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  button-invert:
    backgroundColor: "{colors.on-red}"
    textColor: "{colors.red-deep}"
    rounded: "{rounded.plate}"
    padding: "0.7em 2.6em 0.7em 1.4em"
    height: "52px"
  button-invert-hover:
    backgroundColor: "{colors.on-red-2}"
    textColor: "{colors.red-deep}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.on-red}"
    rounded: "{rounded.plate}"
    padding: "0.7em 1.4em"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.on-red}"
    textColor: "{colors.red-deep}"
  plate:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "10px 12px"
    height: "64px"
  plate-locked:
    backgroundColor: "{colors.signal-wash}"
    textColor: "{colors.ink}"
  tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.tag}"
    rounded: "{rounded.chip}"
    padding: "4px 8px"
  tag-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
  tag-locked:
    backgroundColor: "{colors.signal-fill}"
    textColor: "{colors.on-signal}"
  field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "10px 12px"
    height: "48px"
  page-head:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    typography: "{typography.page-head}"
    padding: "clamp(36px, 7vw, 84px) 0"
  due-chip:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  network-plate:
    backgroundColor: "{colors.on-red}"
    textColor: "#111112"
    rounded: "{rounded.plate}"
    padding: "12px 14px"
---

# Design System: Pitcar Service

## Overview

**Creative North Star: "Livery Malam"**

The site is dressed like a liveried car. Matte panels form the ground (carbon at night, panel white by day), Pitcar red is laid on as whole diagonal fields the way vinyl wraps a door, headlines are cut-vinyl lettering in Chakra Petch, and sections are separated by hairline panel seams instead of boxes. The owner pinned the brief as "cyberpunk, dark and light mode"; the build answers it through material and light, not ornament: a carbon ground, a single teal signal, an x-ray car body, and a red underglow that only exists at night.

Density is workshop-plain. Lists are ruled rows, not card grids. Every complaint and every part is called by its name; the owner banned numeric part codes, so plates read "Mesin", "AC", "Rem", never an identifier. The page's job is fixed and the system serves it: each action ends in a WhatsApp message that is already filled in, and the phone layout keeps that action docked under the thumb.

Both themes are first-class and share one token set under the `--lv-` prefix. Light is not a washed-out copy of dark: by day the car is silver, the signal is a deep teal, and there is no glow; by night the car is graphite, the signal turns luminous, and the stage gains a red rim light and underglow.

**Key Characteristics:**
- Pitcar red as full diagonal fields with a deeper red slash, never as a small accent.
- Chakra Petch uppercase for everything structural; Inter for everything read.
- Hairline seams and 2px rules instead of cards and boxes.
- One signal teal, reserved for the locked state and the focus ring.
- Named part plates; no numeric codes.
- Near-square corners (3px plates, 2px chips) and an 18 degree slant as the recurring cut.
- Dark and light themes driven by the same tokens, including the 3D stage.

## Colors

Three families only: red for brand and action, teal for state, and a neutral panel set that flips with the theme.

### Primary
- **Livery Red** (`red`): the field colour. Hero field, page heads, closing bands, the emergency strip, primary buttons, the due chip, the slider fill, the door livery on the 3D car. Identical in both themes.
- **Slash Red** (`red-deep`): the second tone inside a red field (the diagonal slash at the trailing edge), the button stripe, button hover, and text on white plates inside red.
- **Red Ink** (`red-ink`, `red-ink-dark`): red when it has to be read as text or a thin mark on the ground: text links, step numerals, year numerals, tick marks, the caret. Darker by day, brighter by night for contrast.
- **On Red** (`on-red`, `on-red-2`): lettering on red. Pure white for headlines and buttons, a warm pink-white for supporting copy and the invert button's stripe.

### Secondary
- **Signal Teal** (`signal`, `signal-dark`): the locked state and the focus ring. Deep teal on the light ground, luminous teal on carbon.
- **Signal Fill** (`signal-fill`) with **On Signal** (`on-signal`): the solid luminous teal for the pressed stage tag, with near-black teal text on it. Same in both themes.
- **Signal Wash** (`signal-wash`, `signal-wash-dark`): the faint teal tint behind a locked plate.

### Neutral
- **Panel Ground** (`ground`, `ground-dark`): the page. Panel white by day, carbon by night.
- **Raised Panel** (`panel`, `panel-dark`): plates, inputs, the footer, and the proof band at night.
- **Ink** (`ink`, `ink-dark`): primary text; also the solid fill of stage tags, the ghost button hover, and the proof band by day.
- **Ink 2** (`ink-2`, `ink-2-dark`): secondary copy, captions, input borders, the car outline poster, scrollbar thumb.
- **Seam** (`seam`, `seam-dark`): ink at 18% alpha, the hairline between panels.
- **Body Paint** (`paint-day`, `paint-night`): the 3D car's paint, silver by day and graphite by night. Stage only.

### Named Rules
**The Full Field Rule.** Red arrives as a field that owns its region: the hero wedge, a page head, a closing band, the emergency strip. Each field carries a `red-deep` slash on its trailing edge. Red is not sprinkled as dots, borders, or icon tints; on the neutral ground it appears only as a button plate, a 2px rule, or `red-ink` text.

**The Locked Signal Rule.** Teal means "this part is locked" or "this has keyboard focus", and nothing else. It marks the pressed plate, the pressed tag, the lit system in the car, the rule above the result panel, and the dashes of that panel's cause list. It is never used for links, buttons, headings, or decoration. Inside a red field the focus ring switches to white.

**The Fixed Ink Rule.** Three surfaces do not flip with the theme and therefore use literal inks instead of theme tokens: the odometer drums (always a dark instrument, `#111112` with `#f3f3f3` digits), the white network plate inside the hero field, and the proof band (always dark, with stats in the night red ink). Anything else must use the `--lv-` tokens.

## Typography

**Display Font:** Chakra Petch (with Arial Narrow, sans-serif). Loaded weights: 600, 700, 700 italic.
**Body Font:** Inter Variable (with the system sans stack).

**Character:** Chakra Petch's clipped corners read as lettering cut from vinyl; set in uppercase and tight leading it behaves like a decal, not a headline font. Inter stays out of the way so symptoms and causes read in plain words.

### Hierarchy
- **Display** (700 italic, clamp(2.75rem, 12.5vw, 6rem), 0.9, uppercase): the hero decal on the red field. From 1024px it is capped at clamp(2.75rem, 4.6vw, 4rem) so the copy column, network plate and car share one viewport.
- **Page head** (700 italic, clamp(2.5rem, 8.5vw, 5.25rem), 0.94, uppercase, max 16ch): the h1 of every inner page and the closing band title (closing: clamp(2.25rem, 8vw, 5rem), max 14ch).
- **Headline** (700, clamp(1.75rem, 4.6vw, 3.25rem), 1.02, uppercase, balanced): section titles on the ground.
- **Title** (700, clamp(1.25rem, 2.6vw, 1.625rem), 1.1, uppercase): service names, catalogue rows, plate names (1.125rem to 1.25rem), result panel heads.
- **Numeral** (700, tabular figures): odometer drums at clamp(2.5rem, 11vw, 5.5rem); step and year numerals at 1.75rem to 2rem in red ink.
- **Body** (400, clamp(1rem, 1.6vw, 1.125rem), 1.6, max 62ch): lead and running copy in Inter, in `ink-2` when supporting a headline. Symptom summaries are 600 at 1.0625rem.
- **Label** (700, 0.875rem, sentence case): field labels, list labels, fine print (fine print at 400). Stage tags use Chakra Petch 700 at 0.8125rem.

### Named Rules
**The Cut Vinyl Rule.** Chakra Petch is always 600 or 700 and, for anything that names a section, part, service or step, uppercase. It never sets a paragraph.

**The Italic Rides Red Rule.** The italic cut appears only on lettering applied to a red field (hero decal, page heads, closing titles, the emergency strip) and on the names of new branches in the network list. Headlines on the neutral ground are upright.

**The Sentence Label Rule.** Small Inter labels are sentence case with no added tracking. Uppercase belongs to Chakra Petch.

## Layout

A single centred column (max 80rem) with a fluid gutter (clamp(16px, 4vw, 32px)). Sections are full-bleed bands that alternate by material, not by tint: neutral ground sections, a dark proof band, and red fields. Vertical rhythm is fluid: sections take clamp(56px, 9vw, 112px) of block padding, a headline is followed by its content after clamp(24px, 4vw, 40px), and ruled rows sit on 13px to 26px of padding depending on weight.

Content is laid out as ruled lists and asymmetric splits, not equal card grids: services in two ruled columns from 768px, catalogue rows as name left and tick list right (1fr / 1.25fr), quotes at 1.35fr / 1fr, the proof band as photo and statement (1.05fr / 1fr) from 900px, steps as five columns from 1024px. The part rail is 2 columns on phones, 3 from 640px, 6 from 1024px.

The hero is the one composition that breaks the column. On phones the red field is a block with a slanted bottom edge and the car stage overlaps it by 96px. From 1024px the red becomes a wedge across the left 52% with a diagonal right edge, and the stage fills the viewport from 24% to the right edge so the car crosses the field boundary.

Phones are the primary surface. Below 768px a fixed two-button dock (WhatsApp at 1.5fr, emergency at 1fr) sits at the bottom and the body reserves its height including the safe-area inset; from 768px the same two actions sit inline under the rail. Stage tags shrink to 14px location dots below 640px so they do not bury the car, and only the locked one shows its name. Touch targets are at least 44px (header toggles) and 52px (buttons). Breakpoints in use: 640, 768, 900, 1024.

## Elevation & Depth

Flat. Depth is carried by material change (ground, raised panel, red field, dark band), by seams, and by overlap: the car crossing the red field, the diagonal clip of fields and photos. Lighting belongs to the 3D stage, not to the page.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 14px 30px -18px rgb(17 17 18 / 45%)`; at night `0 14px 34px -16px rgb(0 0 0 / 80%)`): only on things that physically float above the stage or track: stage tags and the slider thumb.
- **Plate on red** (`box-shadow: 0 10px 22px -14px rgb(0 0 0 / 70%)`): the white network plate sitting on the hero field.
- **Lock inset** (`box-shadow: inset 0 0 0 1px` in signal): thickens the border of a locked plate; a state mark, not elevation.

### Named Rules
**The Floating Only Rule.** A shadow is allowed only under an element that overlaps another surface it does not belong to. Sections, rows, plates in the rail, buttons and inputs carry none.

**The Night Light Rule.** Glow exists only inside the 3D stage and only in the dark theme: a red rim light, a red underglow, and a stronger emissive on the locked part. By day the stage has no coloured light. Page elements never glow in either theme.

## Shapes

Near-square. Plates, buttons, inputs, images and the slider thumb take a 3px radius; chips and tags take 2px; the only circles are the 14px location dots that stage tags become on phones. Borders are 1px for structure (plates, inputs) and 2px for emphasis (buttons, alerts, lock rule).

The recurring cut is a slant. Red fields end in a diagonal: the hero field's bottom edge on phones (34px drop), the hero wedge on desktop (100% to 72%), the `red-deep` slash on page heads and closing bands (a polygon from 38% across), the emergency strip's clipped corner (28px) with a hard two-tone split at 104 degrees, and the proof photo's trailing edge (100% to 88%). The primary button repeats it at small scale: a `red-deep` stripe skewed 18 degrees across its trailing edge. The same slanted red band, with PITCAR in italic Chakra Petch, is the door livery on the 3D car.

Dividers are seams: a 1px line in `seam` between rows and sections. A 2px rule marks the top of a unit that needs weight: ink above steps (desktop) and blog entries, red above a testimonial, signal above the locked result panel. List markers are 8px by 2px dashes (red ink in catalogues, signal in the locked panel), and the disclosure mark is a plus built from two bars that folds to a minus.

## Components

### Buttons
Solid plates with one livery stripe.
- **Shape:** 3px radius, 2px border, min-height 52px, Chakra Petch 700 at 1.0625rem, optional 1.3em icon leading the label.
- **Primary:** `red` plate, white text, padding 0.7em 2.6em 0.7em 1.4em to leave room for the `red-deep` stripe (1.5em wide, skewed 18 degrees) on the trailing edge.
- **Hover / Active:** plate turns `red-deep` and the stripe slides inward (0.25s); active presses down 1px. All transitions use the system ease, cubic-bezier(0.16, 1, 0.3, 1), at 0.18s.
- **Ghost:** transparent with an `ink` border on the neutral ground, no stripe; inverts to solid ink on hover. The secondary action next to a primary.
- **Invert:** white plate with `red-deep` text and an `on-red-2` stripe; the primary action inside a red field.
- **Line:** transparent with a white border; the secondary action inside a red field; fills white on hover.
- **Header CTA:** the template's primary button carries the same trailing stripe so the header matches.
- **Text link:** `red-ink`, 600, 2px underline offset 0.22em, 12px block padding for touch; turns ink on hover.
- **Behaviour:** every primary action is a WhatsApp link whose message is already written (part and symptom, mileage, branch question, check-up booking) and tagged by source. There are no forms that submit; the one text field only enriches the outgoing message.

### Chips
- **Stage tag:** `ink` fill with `ground` text, 2px radius, floats over the 3D car on the Float shadow with a 10px invisible hit margin. Hover turns it red; pressed turns it `signal-fill` with `on-signal` text. Below 640px unpressed tags are 14px dots ringed in `ground`.
- **Due chip:** `red` fill, white Chakra Petch 700, 2px radius, 2px 8px padding; marks a maintenance item that is due at the chosen mileage. Items not due are plain `ink-2` text.
- **New tag:** the same red chip at 0.75rem reading "Baru", attached to a new branch name.

### Cards / Containers
There are no cards. Content sits directly on the ground in ruled rows.
- **Part plate:** the one boxed unit. `panel` fill, 1px border in `ink-2` at 70%, 3px radius, min-height 64px (84px from 1024px); name in uppercase Chakra Petch with a one-line summary in `ink-2`. Hover darkens the border to ink. Locked: signal border plus the lock inset, `signal-wash` fill, and the summary is replaced by the word "Terkunci" in signal.
- **Ruled row:** name and description separated from the next by a seam; used for services, catalogue entries, ways of service, due items, timeline years.
- **Proof band:** always-dark full-bleed band, photo with a slanted trailing edge on one side, one statement sentence in Chakra Petch with its figures in red on the other, then a ruled list.
- **Alert:** 2px `red-ink` border, 3px radius, 600 text; only for "do not drive the car" inside a symptom.
- **Network plate:** white plate on the hero field listing the whole Pitcar network as one list.

### Inputs / Fields
- **Text field:** `panel` fill, 1px `ink-2` border, 3px radius, min-height 48px, bold sentence-case label above; hover darkens the border to ink.
- **Range (odometer):** 8px track with 2px radius, filled `red` up to the value and `seam` beyond; thumb is a tall red plate (28px by 36px, 3px radius, 3px `ground` ring) on the Float shadow; end labels below in `ink-2`.
- **Focus:** every focusable element takes a 3px solid outline in signal, offset 3px; white inside red fields.

### Navigation
- **Header:** sits on `ground`; links in Chakra Petch 600; theme and menu toggles are 44px squares with a 3px radius; the CTA is the striped primary button. Anchor targets clear it with 84px of scroll padding.
- **Page head:** every inner page opens with a red field carrying a breadcrumb (underlined white link, slash separator, `on-red-2`), the italic h1, a lead, and invert/line buttons, with the `red-deep` slash on the right 38%.
- **Dock (phones):** fixed bar on `ground` with a top seam, WhatsApp primary and emergency ghost, stripe removed to save width.
- **Footer:** `panel` ground with a top seam, column titles in uppercase Chakra Petch, links in `ink-2` that turn red ink and underline on hover. Sister-brand logos sit on a light chip at night.

### Diagnosa stage (signature)
A 3D car the visitor reads. At rest the body is painted (silver by day, graphite by night) and wears the red door livery and a plate with the Pitcar logo. Selecting a part plate or stage tag locks that system: the camera turns to it, the body fades to a see-through shell drawn in `ink-2`, and the system lights in signal. Bodywork is the shell itself, so it stays solid and takes a signal tint instead. The result panel then rises under a 2px signal rule, and when a symptom is opened its causes wipe in line by line (0.42s each, 80ms apart). The stage reads its colours from the `--lv-` tokens and re-themes when the theme class changes. Before the model loads, an outline drawing of the car holds the space; without WebGL or scripts the plates, symptoms and WhatsApp links still work. Reduced motion removes the camera easing and the line reveal.

### Odometer (signature)
Six always-dark drums showing the chosen mileage in tabular Chakra Petch, leading zeros dimmed, driven by the range slider. A ruled list beside it marks each maintenance item as due (red chip) or names the next mileage, and the button label carries the mileage into the WhatsApp message.

### Closing band
A red field with the `red-deep` slash on the right 34%, an italic title, one sentence, an invert WhatsApp button and an optional line button. It ends every page.

## Do's and Don'ts

### Do:
- **Do** use red as a whole field with a `red-deep` slash on its trailing edge, and put white or `on-red-2` lettering on it.
- **Do** keep signal teal for the locked state and the focus ring; switch the focus ring to white inside red.
- **Do** name parts, symptoms and services in the owner's words ("Mesin", "Rem", "AC").
- **Do** present the Pitcar network as one list: Purwokerto, Cilacap (Otokits), Purbalingga, Tegal, Batam, Auto Accessories, Autopart, with new entries tagged "Baru".
- **Do** end every action in a WhatsApp link with the message already written, and keep WhatsApp and the emergency line reachable without scripts.
- **Do** separate content with 1px seams and 2px rules, on 3px and 2px corners.
- **Do** build every new surface for both themes from the `--lv-` tokens, and check the 3D stage in both.
- **Do** set structural lettering in uppercase Chakra Petch 700 and running copy in Inter.
- **Do** honour reduced motion: the stage and the line reveal already do.

### Don't:
- **Don't** give parts or symptoms numeric identifier codes. Real quantities (kilometres, years, counts, step order) are fine and are set in tabular numerals.
- **Don't** show service prices. Estimates come from the admin in chat.
- **Don't** split the branch network into separate groups or separate blocks per brand.
- **Don't** use red as a small accent: no red dots, red icon tints, or red hairlines scattered on the ground.
- **Don't** use teal for links, buttons, headings or decoration.
- **Don't** wrap content in cards, or add shadows to anything that is not floating over another surface.
- **Don't** set italic Chakra Petch on the neutral ground, or uppercase Inter labels.
- **Don't** make page elements glow; night lighting lives in the 3D stage only.
- **Don't** reuse the legacy AstroWind widgets (`src/components/home`, `src/components/widgets` content blocks, blog list cards) as patterns; they still carry the old look and are outside this system.
