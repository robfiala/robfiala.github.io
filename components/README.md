# Components: Video Grid

This folder archives the previous video grid implementation so it can be easily restored later.

## Files

- `video-grid.html`: Filters, grid markup, example items, and reusable modal structure.
- `video-grid.css`: Styles for filters, grid, items, overlay, play icon, and info blocks.
- `video-grid.js`: Filtering logic and modal open/close with YouTube/Vimeo/MP4 support.

## Usage

1. Paste the contents of `video-grid.html` into your page where the video section should appear.
2. Include `video-grid.css` or copy its relevant rules into your main `css/style.css`.
3. Import/initialize the JS logic:
   ```html
   <script type="module">
     import { initVideoShowcase } from "../components/video-grid.js";
     initVideoShowcase();
   </script>
   ```
4. Ensure the modal markup (`#videoModal` with `#videoContainer`) is present.

## Notes

- The CSS assumes your theme variables like `--accent-primary` and `--accent-glow` exist.
- The JS expects `.filter-btn`, `.video-item[data-category]`, `.video-play-btn`, and the modal `#videoModal` & `#videoContainer`.
- Thumbnails and categories are examples; duplicate blocks and adjust `data-category`, titles, and sources as needed.
