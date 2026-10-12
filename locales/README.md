# Presentation languages

`script-v2.html` has an English / Español (Latinoamérica) selector above the presentation and in the recording setup. It updates the slides, captions, diagram labels, timeline, FAQ, controls, accessibility text, and spoken narration. The current slide and animation position are preserved; changing languages restarts the current narration in the selected language if it was playing.

The selection is remembered locally. Links may also specify `?lang=es-419` or `?record&lang=es-419`.

The **Narrator script / Guion de narración** section below the timeline displays all 34 narration passages and downloads the selected version as Markdown. `narrator-es-419.md` is the Spanish export for recording a voice-over separately.

The Spanish catalog uses Latin American phrasing and keeps the character names from the English presentation for continuity. Browser speech prefers Mexican Spanish, then Latin American Spanish voices, then other Spanish voices. Voice choices are saved separately for each language. If no matching voice is available, the narration button is disabled with an explanation; it does not substitute an English voice for Spanish. The translated slides and script remain available.

Edit `es-419.js` for translations and `../tools/localization-runtime.js` for switching behavior. Run:

```sh
node tools/install-localization.cjs
node tools/check-localization.cjs
```

The installer embeds both sources in the HTML, preserving offline use, and regenerates the Spanish narrator script. English source text and narration remain in the presentation.
