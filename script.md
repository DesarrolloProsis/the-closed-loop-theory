# Skyward Sword: the closed-loop theory

A single-timeline reading of Skyward Sword with no branches. Every
character and object follows one continuous path through time. Scenes
are in calendar order, as an outside observer would see them, so
arrivals often appear before the matching departures.

## Core claims

1. **The leak.** Demise's hatred, absorbed into the Master Sword after
   his death, seeps back out over the centuries and re-forms the
   Imprisoned. The beast Link fights in the present is the result of
   his own future victory.
2. **The gate.** Impa doesn't destroy the Sealed Temple's Gate of Time.
   She seals it dormant, and that dormant gate is the one Link
   reactivates in the present.
3. **One sword, aged twice.** The young Goddess Sword waits in the
   statue while the aged Master Sword sleeps in a hidden pedestal. Both
   live through the same millennia side by side. The temple conceals
   the pedestal with the same magic that hides the Gate of Time until
   the Ballad is played, so it stays hidden after Impa fades.

---

## Part one: the distant past

### Scene 1: Hylia seals Demise
*Hylia's realm*
The goddess defeats the demon king and seals him in the earth. Trapped
below, Demise decays into the Imprisoned.

### Scene 2: The sword waits in the sky
*The land rises*
Hylia lifts her people skyward on an island and leaves the Goddess
Sword inside her statue. Then she gives up her divinity to be reborn as
a mortal. The sword's first trip through the millennia begins here.

### Scene 3: Zelda and Impa arrive
*Temple of Time, desert*
Young Impa and Zelda burst out of the desert gate, fleeing Ghirahim in
the present. Impa destroys the gate behind them. Their story here
begins in the middle; scene 10 shows where it starts.

### Scene 4: The blessing and the crystal
*Temple of Hylia*
Link steps through the Sealed Temple gate. Zelda blesses his sword,
then seals herself in a crystal to hold the Imprisoned down. Impa
begins her long watch.

### Scene 5: Two Zeldas, one ritual
*Hylia's realm, later*
Ghirahim drags the present-day Zelda out of the gate, so two Zeldas now
share this era: one asleep in the crystal and one awake. Her soul is
fed to the Imprisoned, and Demise rises whole.

### Scene 6: The final duel
*Hylia's realm*
Link and Groose follow through the gate. Link slays Demise, and the
demon king's hatred is drawn into the sword. Zelda's soul returns to
her.

### Scene 7: Planted and hidden
*Temple of Hylia*
Link drives the sword into the pedestal and Fi goes to sleep. The
temple hides it from sight. Link, Zelda, and Groose head home, and
Impa seals the gate dormant behind them. The sword's second trip
through the millennia begins here.

### Scene 8: The long watch
*Millennia pass*
Young Impa grows old guarding the crystal and the hidden blade. Hatred
seeps from the sword and slowly re-forms the Imprisoned. Two copies of
the sword wait: one in the sky, one below.

---

## Part two: the present

### Scene 9: A hero falls from the sky
*Sealed Grounds*
Zelda has fallen to the surface. Link draws the Goddess Sword from the
statue and dives after her. Old Impa waits beside the crystal, already
visible behind her door.

### Scene 10: The escape, seen from here
*Temple of Time, desert*
Young Impa came forward from the past to protect Zelda, so this era
holds two Impas. With Ghirahim closing in, they flee through the
desert gate and destroy it. This is scene 3 from the other side.

### Scene 11: The dormant gate wakes
*Sealed Temple*
Old Impa teaches Link the Ballad of the Goddess, and the Sacred Flames
temper his blade into the Master Sword. The gate wakes and Link steps
into the past. This is scene 4 from the other side.

### Scene 12: The wish and the waking
*Sealed Grounds*
Link's wish brings the statue crashing down on the Imprisoned,
destroying this era's beast. With the seal no longer needed, Zelda
wakes from her crystal.

### Scene 13: Dragged into the past
*Sealed Grounds*
With no Imprisoned left in this era, Ghirahim seizes Zelda and drags
her back to the past. Link and Groose follow. This is scenes 5 and 6
from the other side.

### Scene 14: The loop closes
*Sealed Temple*
Link, Zelda, and Groose return. Old Impa's watch is over, and she fades
away. Link's sword stayed in the past, so the hidden, aged blade is now
the only one.

---

## Scene pairs (the same moment from both ends of a gate)

| Departure (present) | Arrival (past) |
|---|---|
| Scene 10 | Scene 3 |
| Scene 11 | Scene 4 |
| Scene 13 | Scenes 5 and 6 |
| Scene 7 (past) | Scene 14 (present) |

---

## Editing the presentation

- **Scene text** lives in the `S` array: `l` is the location, `t` is
  the title, `c` is the caption, and `e` is the era (0 = past,
  1 = present).
- **Movement:** each entry in `k` is `[x, y, opacity, scale]` for a
  static element, or
  `[x1, y1, o1, s1, x2, y2, o2, s2, delay]` for one that animates from
  the first state to the second. `stateAt()` scales delays by `DELAY`
  and interpolates travel over `TRAVEL` seconds. The ground line is
  at y = 170, the scene is 340 units wide, and y = 192 is underground.
  Scene-specific staging adjustments follow the `cues` array.
- **Pixel sprites:** `makeFigure()` displays a frame from a transparent
  pixel-art atlas. Each character has eight poses with distinctive
  costume colors; the Imprisoned has four. `SPRITES` embeds all character
  and prop atlases so the HTML still works independently and offline. The
  sprites stand with their feet at y = 20, at a scene position of
  y = 150. Names appear in the character key and accessible SVG titles.
  Link is 56 pixels tall and Zelda is 46. Zelda's first two appearances
  (scenes 2 and 3) use pink sleeves, a small plain apron, and green hair
  wraps covering her front side bangs; scene 10 repeats scene 3 and keeps
  that outfit. From the blessing
  onward she wears a plain white dress with matching bluish-purple hair
  wraps and sandals. The bindings are elongated cloth sleeves around the
  side locks, with short blonde tips showing. `setZeldaOutfit()` swaps the eight-frame atlas for both
  Zelda actors while preserving the active pose. The crystal also uses
  her white dress; its artwork is enlarged so the enclosed Zelda is roughly
  46 pixels tall, matching her normal sprite. Its amber shell extends
  around her, and the crystal retains that scale across scenes.
  Old Impa's silhouette is dominated by her red pointed hat.
- **Actions:** each character's entry in `cues` contains
  `[seconds, poseName]` keyframes. `poseAt()` selects the active cue,
  `walkPose()` alternates travel frames, and `poseFrames` maps the pose
  names to atlas columns. `grips` positions held props for each frame.
  The action artwork changes in discrete frames while scene travel
  remains smooth.
- **Sprite assets:** generated source sheets, prepared atlases,
  and the manifest are in `assets/sprites`. To repackage changed source
  sheets on Windows, run `tools/prepare-sprites.ps1`, then
  `node tools/install-sprites.cjs`. Preparation crops transparent
  cells, normalizes character sizes and foot baselines, and scales
  with nearest-neighbor sampling. The installer embeds the atlases.
  To prepare selected edited sources, pass `-Sheets` with their sheet
  names; the existing manifest retains all other artwork.
- **Future item sprites:** `assets/sprites/triforce.png`,
  `assets/sprites/goddess-harp.png`, and `assets/sprites/zelda-bracelet.png`
  are prepared transparent 80-by-80 tiles for future scenes. Their artwork
  heights are 32, 26, and 18 pixels. Larger source PNGs and generation
  prompts are in the same directory. They use the existing manifest and
  baseline conventions.
- **Future Lanayru sprites:** `assets/sprites/lanayru.png` and
  `assets/sprites/life-tree-fruit.png` are transparent 80-by-80 tiles,
  with artwork heights of 68 and 24 pixels. Lanayru uses his healthy
  seated pose, yellow robe, white beard, and cyan coil markings. The
  fruit keeps its orange body and turquoise spiral stem. Source PNGs
  and exact generation prompts are saved alongside the tiles in
  `assets/sprites/LANAYRU-AND-LIFE-FRUIT-PROMPTS.md`.
- **Props and effects:** the Goddess Sword, Master Sword, Demise's sword,
  the crystal containing sleeping Zelda, the winged Goddess Statue, and
  the Gate of Time have their own pixel artwork. The gate is a large
  circular cog with turquoise engraved rings. It rotates around its
  center when waking. The statue keeps its rising island and falling
  animation; the island and tiny inhabitants use stepped pixel details.
  `setHeldSword()` changes the held blade from Goddess to Master Sword
  during forging. `render()` coordinates held swords, the harp,
  spell trails, gate fragments, crystal, soul, hatred, and Fi with the
  same scene clock. Edit its scene-specific branches to change those
  actions. Scene indices in code start at zero.
  The corrected art specifications are recorded in
  `assets/sprites/REFINEMENT-PROMPTS.md` and
  `assets/sprites/WHITE-DRESS-AND-PROPS-PROMPTS.md`. The revised side-bang
  binding specifications are in `assets/sprites/HAIR-WRAP-PROMPTS.md`.
- **Playback:** scenes last eight seconds. Play all, pause, replay,
  the progress slider, and the numbered scene buttons control the
  presentation. Arrow keys select scenes, Space plays or pauses, and
  R replays. Reduced-motion preferences show the completed scene
  until playback is explicitly requested.
- **Opening:** open `script.html` directly in a browser. It contains
  its own styling, embedded sprite artwork, and animation code and needs no build,
  installed packages, or network connection.
