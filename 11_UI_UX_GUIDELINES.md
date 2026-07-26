# UI / UX GUIDELINES

## Design Principles

- **Clarity first** — reduce cognitive load at every step
- **Progressive disclosure** — show complexity only when needed
- **Feedback immediacy** — every action must have < 100ms visual feedback
- **Consistency** — same patterns, same language, same motion across the app

## Design System

| Token | Rule |
|---|---|
| Colors | CSS variables; 3 semantic palettes (brand, neutral, feedback) |
| Typography | System font stack + 1 display font max; defined scale (12–48px) |
| Spacing | 4px base unit; multiples of 4 only |
| Border radius | Consistent scale: 4, 8, 12, 16, 24px |
| Shadows | 3 elevations: low, medium, high |
| Motion | Duration: 150ms (micro), 300ms (transition), 500ms (page) |

## Dark Mode

- CSS variable-based — no JS class toggling for colors
- Default to system preference (`prefers-color-scheme`)
- Persist user preference in localStorage
- All components must be tested in both modes

## Animation Rules

- Use **Framer Motion** for complex sequences
- Use **CSS transitions** for simple hover/focus states
- Always respect `prefers-reduced-motion` — disable or reduce animations
- No animation longer than 500ms for UI transitions
- No animation that blocks user interaction

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Color contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- All interactive elements keyboard-navigable
- Focus indicators visible and styled
- Screen reader tested (NVDA + VoiceOver)
- No content conveyed by color alone

## Fitness-Specific UX Patterns

- **Workout mode** — full-screen, distraction-free, large touch targets
- **Progress visualization** — charts with accessible color palettes
- **Camera UI** — pose overlay must be low-latency, clearly labeled
- **Voice feedback** — visual transcript alongside audio for accessibility
