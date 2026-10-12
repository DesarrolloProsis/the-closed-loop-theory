# Young Impa hair correction

## Reference-based refinement

Official Nintendo reference: https://www.nintendo.com/au/games/nintendo-switch/the-legend-of-zelda-skyward-sword-hd/

Downloaded artwork: `../references/impa-official.png`. Used as the hair-only reference with the built-in image_gen tool. The final source replaces `impa-v2-source.png`.

### Initial refinement prompt

Use case: precise-object-edit. Image 1 is the EDIT TARGET: eight-frame Young Impa pixel sprite sheet. Image 2 is official Nintendo Skyward Sword Impa artwork, HAIR REFERENCE ONLY. Correct ONLY the hair of all eight sprites to match image 2. The existing fluffy white hairstyle and thick hanging lock are WRONG. Replace the fluffy hair mass with extremely short, close-cropped pale ash-blond hair hugging the skull, almost a buzz cut; no puff, spikes, swept-back volume or side tufts. Expose her pointed ears and keep skull compact. Replace the big white segmented tube on the front with ONE delicate very thin slightly curved tapered front bang from the forehead, passing beside the face and ending around collarbone. Make this bang only ONE QUARTER of its current width: a fine line, not a thick rope or braid. At final 60-pixel-tall sprite scale this is a 1-pixel-wide light line with 2 or 3 tiny muted red binding marks. Remove the broad bright red bands and stray red halo around head. Hair should be subtle, face and costume remain visually dominant. Use the reference's hair silhouette faithfully. Preserve exactly the eight existing poses and directions, face identity, navy outfit, orange sash/scarf, limbs, boots, pixel style and proportions. Do not copy reference clothing or stance. Exactly eight full figures, same order, one horizontal row, equal cells and clear transparent gutters. Genuine transparent background; no labels.

### Final refinement prompt

Edit this sprite sheet again. The hanging white bang is STILL FAR TOO THICK. In every frame reduce the width of that hanging lock by 75 percent, leaving an extremely fine hair strand, nearly a single-pixel diagonal line in the pixel-art vocabulary of this sheet. Erase the thick white rope down the chest and restore the navy shirt behind it. Draw only a hair-thin curved line next to the cheek down to collarbone, two barely perceptible red stitches; no large red bands. The skull hair must be a very short close-cropped pale stubble cap, NOT a rounded white bob: remove sideburns and all bulk at the back of the head. Keep the face exposed and the ear exposed. Match the second image official hair reference: extremely close cropped skull and very thin front lock. Preserve all eight poses, clothes, proportions, colors and pixel-art style. Transparent background. Only change the hair. Make the thinning very substantial and unambiguous.

Created with the built-in image_gen tool from `impa.png`. Generated source: `impa-v2-source.png`; prepared atlas: `impa.png`. Rebuild with `tools/prepare-sprites.ps1 -Sheets impa-v2`.

## Prompt

Use case: precise-object-edit. Edit target: attached Young Impa eight-frame pixel sprite atlas. Change ONLY her hair in all eight frames: remove the long white braided ponytail hanging from the BACK of her head. Instead give her ONE long smooth stylized ivory-white FRONT bang growing from the forehead/temple and falling in front of the cheek down toward her chest, bound with three small thin RED laces spaced along the single smooth tapered lock. No plaiting, no interwoven braid lobes, no rear ponytail. The rest of her hair is short and swept back close to her head. Preserve each of the exact eight poses, facing directions, face, navy outfit, orange scarf, limbs, boots, pixel-art style and colors. Exactly eight complete figures in one horizontal row, equal cells, spacious transparent gutters, no labels. Genuine transparent background. This is a game animation atlas, so keep all eight frames in order and the characters' proportions consistent. Tight crisp pixel artwork.
