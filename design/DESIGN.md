# Design System Document: The Sonic Curator

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Stage"**
This design system rejects the "flat web" aesthetic in favor of a high-end, editorial experience that treats music as high art. We are moving beyond the standard streaming template by embracing a "Stage and Spotlight" philosophy. The UI is the dark, silent auditorium (Obsidian), and the content is the illuminated performance. 

By leveraging intentional asymmetry—such as oversized display typography paired with compact metadata—and replacing rigid borders with tonal layering, we create a sense of infinite depth. This system is designed to feel like a premium physical object: sleek, tactile, and expensive.

---

## 2. Colors & Tonal Depth
The palette is rooted in deep blacks and high-vibrancy greens, but the "premium" feel is found in the grays between them.

- **Primary (`#72fe8f`):** Used sparingly for high-action "Spotlight" moments.
- **Surface & Background (`#0e0e0e`):** The foundation. It is a true dark, providing the "infinite" depth required for a sleek feel.
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate the navigation sidebar from the main feed, use a shift from `surface_container` (`#1a1a1a`) to `surface` (`#0e0e0e`). Use vertical space (Spacing Scale `8` or `12`) to define content groups.
- **The "Glass & Gradient" Rule:** Floating players and navigation bars must utilize `surface_container_highest` (`#262626`) at 80% opacity with a `20px` backdrop blur. This "Glassmorphism" ensures the vibrant album art colors bleed through subtly, grounding the UI in the music.
- **Signature Textures:** For primary Action Buttons, use a linear gradient from `primary` (`#72fe8f`) to `primary_container` (`#1cb853`) at a 135° angle. This adds a "jewel-like" dimension that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority
We use a dual-typeface system to balance high-fashion editorial headers with hyper-legible utility.

*   **Display & Headlines (Plus Jakarta Sans):** Chosen for its wider stance and modern apertures. Use `display-lg` for artist names and `headline-lg` for playlist titles. To achieve the "Curator" look, use tight letter-spacing (-2%) on all display styles.
*   **Body & Labels (Manrope):** A workhorse sans-serif with high x-heights. Manrope ensures that even at `label-sm` (`0.6875rem`), track durations and credits remain crisp against the dark background.
*   **Hierarchy Tip:** Never use two font sizes that are adjacent in the scale (e.g., don't put `body-md` next to `body-lg`). Skip a level to create "Visual Tension" and clarity.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" does not mean "Shadow." "Up" means "Brighter."

*   **The Layering Principle:** 
    *   **Level 0 (Floor):** `surface_dim` (`#0e0e0e`) - Main background.
    *   **Level 1 (Sections):** `surface_container_low` (`#131313`) - Content areas.
    *   **Level 2 (Cards):** `surface_container` (`#1a1a1a`) - Individual album/track cards.
    *   **Level 3 (Interaction):** `surface_bright` (`#2c2c2c`) - Hover states and active selections.
*   **Ambient Shadows:** Use shadows only for "floating" elements (e.g., Context Menus). Use a `40px` blur, `0%` spread, and the color `on_surface` (`#ffffff`) at `4%` opacity. This mimics a soft glow rather than a heavy drop shadow.
*   **The Ghost Border:** For accessibility in input fields, use `outline_variant` (`#484847`) at `20%` opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `full` roundedness. Text: `label-md` (Bold).
- **Secondary:** `surface_container_highest` fill, no border. For high-contrast "Ghost" buttons, use `outline` color for text only.
- **Tertiary:** No fill, no border. Use `on_surface_variant` for the icon/text, switching to `on_surface` (white) on hover.

### Cards & Lists
- **The "No-Divider" Rule:** Lists (like tracklists) must never use horizontal lines. Use a `surface_bright` background on hover to define the row.
- **Album Art:** Use `DEFAULT` (`1rem`) roundedness. For "Artist" profiles, use `full` (circular) to distinguish people from products.
- **Spacing:** Use `spacing-4` (`1rem`) for internal card padding and `spacing-8` (`2rem`) for grid gaps.

### The "Pulse" Player (Custom Component)
The bottom player should not be a docked bar. It should be a floating "Island" using `surface_container_highest` with a glassmorphism blur and `md` (`1.5rem`) roundedness. This makes the player feel like a modern OS element rather than a legacy web footer.

### Input Fields
- **Search:** Use `surface_container_low` with a search icon in `on_surface_variant`. Avoid 100% white backgrounds; keep the eye acclimated to the dark theme.

---

## 6. Do's and Don'ts

### Do:
- **Use "Oxygen":** Use large amounts of whitespace (`spacing-12` and `16`) between major sections to emphasize the premium feel.
- **Embrace Asymmetry:** Align large artist imagery to the right, while keeping typography anchored to the left to create a dynamic, editorial flow.
- **Tonal Transitions:** Use `surface_container` tiers to guide the eye from the navigation to the content.

### Don't:
- **Don't use pure white text for everything:** Use `on_surface` (`#ffffff`) for headlines, but `on_surface_variant` (`#adaaaa`) for secondary body text to reduce eye strain and establish hierarchy.
- **Don't use sharp corners:** This system is "Sleek & Human." Every element (except the screen itself) must have at least `sm` (`0.5rem`) roundedness.
- **Don't use "True Black" (#000000) for containers:** Reserve `#000000` (`surface_container_lowest`) only for the deepest background areas to maintain the ability to layer darker elements on top.