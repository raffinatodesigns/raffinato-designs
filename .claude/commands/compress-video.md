Compress a video file for web use. Ask me for the input file path if not provided as $ARGUMENTS.

Run this ffmpeg command (requires ffmpeg to be installed via Homebrew):

```
ffmpeg -i [INPUT] -vf "scale=1920:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart [OUTPUT]
```

- Input: the original file path provided
- Output: same directory as input, same filename with `-web` appended before the extension
- `-an` strips audio (hero videos don't need it)
- `-movflags +faststart` makes it stream immediately in browser

After compression, report:
- Original file size
- Compressed file size
- % reduction

If the output is still over 8MB, suggest increasing CRF to 32 and re-running.
