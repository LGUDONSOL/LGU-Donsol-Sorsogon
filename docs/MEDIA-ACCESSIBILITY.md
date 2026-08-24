# Donsol Tourism media accessibility register

The website uses externally hosted third-party video. Equivalent visitor-planning information is provided in text, and promotional videos are muted by default. Caption text must not be invented; it must match the approved audio exactly.

## Current video inventory

| Video | External asset | Text alternative | Caption status |
| --- | --- | --- | --- |
| Donsol and whale shark promotional video | `1_Butanding_web_oyhlem.mp4` | Whale shark guide and media summary | Approved transcript or captions not yet supplied |
| Kayaking and river cruising preview 1 | `kayaking-video-01_wlpiut.mp4` | Kayaking guide and media summary | Approved transcript or captions not yet supplied |
| Kayaking and river cruising preview 2 | `kayaking-video-02_w4ppcm.mp4` | Kayaking guide and media summary | Approved transcript or captions not yet supplied |

All three source files contain audio tracks. The presence of an audio track does not establish whether it contains speech, music, ambient sound, or a combination, so the media rights holder or Tourism Office must confirm the content.

## Caption publishing gate

1. Obtain the final public video and an approved transcript from the rights holder.
2. Identify dialogue, narration, speakers when necessary, and meaningful non-speech audio.
3. Create a synchronized WebVTT caption file and have it reviewed against the exact public video.
4. Host the approved `.vtt` file at a stable HTTPS URL.
5. Add that URL as `data-media-captions` on the video's `data-media-item` button. The website will automatically attach it as the default English caption track.
6. Test captions with keyboard controls, mobile playback, sound off, and at least one screen reader or accessibility inspection tool.

If the audio is only decorative music or ambient sound, keep the video muted by default, retain the text summary, and label meaningful sound in a short approved description. If narration or dialogue provides information not already available in text, captions are required before that audio is used as public information.

## Accessible media request

Visitors who cannot access a third-party video should be directed to the text-based destination guide or the Donsol Tourism Office. Accessibility concerns should be recorded and reviewed under the website's monthly content process.
