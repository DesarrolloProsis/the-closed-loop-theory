# Sprite generation

The current Zelda, Old Impa, Imprisoned, swords, and crystal designs use
the corrections in [REFINEMENT-PROMPTS.md](REFINEMENT-PROMPTS.md).

Generated with the built-in imagegen tool, with `transparent_background: true`.
The original PNG sheets remain alongside the prepared character atlases.

## Shared prompt for the three character sheets

Use case: illustration-story. Asset type: transparent animation sprite atlas for a Skyward Sword presentation. Create polished 8-bit-inspired PIXEL ART, with visibly square pixel clusters, stepped silhouettes, dark 1-pixel outlines, readable eyes, 3-tone costume shading, rich distinctive colors. Small RPG sprites with heads about one third of total height; full bodies with filled colored limbs, NOT stick figures. Orthographic side/three-quarter view facing RIGHT, no perspective. The canvas must be a precise 8-COLUMN by 3-ROW grid of 24 equal cells. Each cell has exactly one isolated sprite, no overlap, no grid lines, no labels, no text, no scenery, no shadows. GENUINELY TRANSPARENT background. Every sprite stays fully inside its cell, centered horizontally, feet on the same baseline at 85% cell height. Leave empty margin in each cell; characters occupy about 75% cell height, not more. All eight columns in a row show the SAME character with the SAME costume and scale in different poses. Columns from left to right: 1 neutral standing idle; 2 walking with left foot forward; 3 walking with right foot forward; 4 running stride; 5 right arm reaching forward, casting or grabbing; 6 right hand raised above head (empty hand); 7 kneeling with hands near chest, head bowed; 8 powerful forward lunge with right hand extended horizontally (empty hand). NO SWORDS OR HANDHELD PROPS, they are animated separately. Pose frames should be crisp discrete pixel art, no antialiasing, no gradients, no blur.

## Heroes sheet additions

ROW 1 Link: pointed forest-green cap trailing left, bright blond fringe, blue eyes, emerald tunic, darker green sleeves, white leggings, brown leather boots and belt, gold belt buckle, brown diagonal chest strap. ROW 2 Zelda: very long golden blond hair, blue eyes, magenta-pink ankle-length dress, ivory sleeves, golden belt and bracelets, blue and gold geometric apron panel, brown shoes. ROW 3 Groose: muscular broad shoulders, tan skin, unmistakable huge swept-back crimson pompadour, yellow-brown sleeveless jacket over teal-blue top, navy trousers, red belt, brown boots. Make the character designs richly readable at small sizes, nostalgic console RPG quality.

## Guardians sheet additions

ROW 1 Hylia: ethereal pale goddess, flowing ivory and lavender gown with gold trims, long platinum-gold hair, two small white feathered wings, gold halo. ROW 2 YOUNG Impa: tall slender Sheikah woman, warm brown skin, white-blond hair in long high braid trailing left, blue sleeveless bodice and blue trousers, orange-red long sash around waist, dark boots, small red facial marking. ROW 3 OLD Impa: notably shorter hunched elder, ochre-yellow hood with red-orange edge, deeply aged brown face, dark burgundy-brown robe with gold details, white-gray hair, olive shawl, brown shoes. Old Impa should stay hunched in all poses, clearly distinct from young Impa.

## Spirits sheet additions

ROW 1 Demise: imposing muscular demon king, charcoal-gray skin and armor, huge flame-shaped crimson and orange hair, fierce gold-red eyes, black arm wraps, dark steel gray armored legs, red belt and angular gold ornaments. ROW 2 Ghirahim: slim pale gray demon lord, sharply asymmetrical white hair covering one eye, narrow violet-red eye, white fitted bodysuit with dark plum-gray markings, rich red-purple diamond-pattern cape, gold earring and belt, white and black boots; distinctive diamond motifs. ROW 3 Fi: elegant floating sword spirit, pale blue face, short angular deep indigo bob, vivid cyan-to-violet cloak shaped like angular folded wings, dark purple diamond-shaped chest detail, slender cobalt legs with magenta accents; float just slightly above the normal baseline. No arms of flesh: her cloak extensions act as arms.

## Imprisoned sheet prompt

Use case: illustration-story. Asset type: transparent 8-bit-inspired animation sprite sheet for Skyward Sword. A single horizontal row of FOUR equally sized cells, each containing one full-body sprite of THE IMPRISONED: gigantic squat charcoal black scaly beast, round head fused to pear-shaped body, mouth of pointed white teeth, no eyes, short broad legs with three huge ivory toes on each foot, three tiny dark spikes on crown, glowing purple-black scaly details. Menacing but charming classic Zelda RPG pixel sprite style, vivid deliberate square pixel clusters, flat 3-tone shading, dark pixel outlines. No arms, no humanoid body, no face eyes. Columns left to right: 1 looming idle, 2 walking with left foot lifted, 3 walking with right foot lifted, 4 hunched down as if struck or emerging from earth. Exact evenly spaced 4-column single-row grid, each sprite centered within its own equal cell, feet at the same baseline at 85% cell height, generous transparent margin. Genuinely transparent background, no scenery, ground, shadows, grid, labels, or text. Consistent size, facing slightly right, identical design in each frame. Chunky nostalgic 8-bit inspired bitmap pixels, no smooth painting or gradients.
