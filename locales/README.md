# Presentation languages

`script-v2.html` and `script-v3.html` each have an English / Español (Latinoamérica) selector above the presentation and in the recording setup. It updates the slides, captions, diagram labels, timeline, FAQ, controls, accessibility text, and spoken narration. The current slide and animation position are preserved; changing languages restarts the current narration in the selected language if it was playing.

The selection is remembered locally. Links may also specify `?lang=es-419` or `?record&lang=es-419`.

The **Narrator script / Guion de narración** section below the timeline displays every narration passage (34 in version 2, 35 in version 3) and downloads the selected version as Markdown. `narrator-es-419.md` (version 2) and `narrator-v3-es-419.md` (version 3) are the Spanish exports for recording a voice-over separately.

The Spanish catalog uses Latin American phrasing and keeps the character names from the English presentation for continuity. Browser speech prefers Mexican Spanish, then Latin American Spanish voices, then other Spanish voices. Voice choices are saved separately for each language. If no matching voice is available, the narration button is disabled with an explanation; it does not substitute an English voice for Spanish. The translated slides and script remain available.

Edit `es-419.js` for translations shared by both versions, `es-419-v3.js` for what version 3 changes or adds (it loads after the shared catalog and overrides it), and `../tools/localization-runtime.js` for switching behavior. `../tools/localization-versions.cjs` lists which catalogs each presentation embeds. Run:

```sh
node tools/install-localization.cjs
node tools/check-localization.cjs
```

The installer embeds the catalogs and runtime in each HTML file, preserving offline use, and regenerates both Spanish narrator scripts. The checker validates every slide, label, timeline text, card, and FAQ entry in both versions. English source text and narration remain in the presentation.
