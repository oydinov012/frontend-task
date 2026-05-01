---
name: TaskApp Core
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002387'
  primary-container: '#2d5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#104af0'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0035bd'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered for high-performance productivity, targeting professionals who require a focused, low-distraction environment. The brand personality is "Precision Technical," blending **Modern Corporate** reliability with a **Minimalist** aesthetic. 

The UI evokes a sense of calm authority and momentum. It utilizes deep blacks to reduce eye strain, punctuated by high-vibrancy accents that guide the user's attention toward action and status. The interface relies on structural integrity—using clear vertical rhythms and crisp boundaries rather than decorative flourishes—to communicate efficiency and order.

## Colors

The color strategy for this design system utilizes a "Void" foundation. The primary background is a deep, singular Charcoal (#121212), which provides a stable base for the Electric Blue primary accent. This blue is reserved for primary actions and focus states to ensure maximum "pop" against the dark canvas.

Status colors are functional: Emerald Green is used exclusively for completion and success, while Amber signifies pending or high-priority items. Secondary text and borders utilize muted greys to maintain a clear visual hierarchy, ensuring the content remains the focal point.

## Typography

This design system employs **Inter** for its exceptional legibility in digital interfaces and its neutral, systematic character. The typographic scale is tightly controlled to reinforce the professional tone. 

Headlines use slight negative letter-spacing and heavier weights to feel "grounded," while body text maintains a generous line height for readability during long sessions. A specific "Label Caps" style is introduced for category headers and metadata, providing a distinct visual break from task descriptions.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop, transitioning to a single-column stack on mobile. The system follows an 8px baseline grid to ensure mathematical harmony across all components.

Vertical density is prioritized; task lists use a compact vertical rhythm (12px - 16px between items), while high-level dashboard sections are separated by larger gaps (48px) to create clear mental "rooms" for different types of work. Vertical timelines should align to the left margin of their container, with a 2px stroke connecting chronological nodes.

## Elevation & Depth

In this dark-mode environment, depth is communicated through **Tonal Layers** rather than heavy shadows. As elements "rise" toward the user, their background color becomes slightly lighter (e.g., from #121212 to #1E1E1E).

To maintain a sleek aesthetic, use **Low-Contrast Outlines** (1px solid borders at #333333) for cards and containers. This creates a "blueprint" feel that is more professional than diffused shadows. Shadows, if used, should be limited to active modal windows and should be tight, dark, and almost invisible, serving only to separate the modal from the background.

## Shapes

The shape language is "Soft-Technical." By choosing a **Soft (0.25rem)** roundedness, the UI feels modern and approachable without losing the professional "edge" of a productivity tool. 

Larger containers like cards may use the `rounded-lg` (0.5rem) token to provide a clear frame for content, while buttons and input fields stay at the base `rounded` (0.25rem) to maintain a crisp, clickable appearance.

## Components

- **Buttons:** Primary buttons feature a solid Electric Blue background with white text. They must have a high contrast ratio. Secondary buttons use a ghost style (transparent fill, #333333 border).
- **Cards:** Sleek containers with a #1E1E1E fill and a subtle #333333 border. No shadows. Padding should be a consistent 24px (md).
- **Vertical Timeline:** A 2px vertical track in #333333. Active nodes are Electric Blue; completed nodes are Emerald Green circles with a checkmark icon.
- **Input Fields:** Darker than the card surface (#121212) with a 1px border. On focus, the border transitions to Electric Blue with a subtle 2px outer glow of the same color.
- **Chips/Status Badges:** Use a "Tinted Ghost" style—a low-opacity version of the status color for the background (e.g., 10% Emerald Green) with a high-saturation border and text in the same hue.
- **Checkboxes:** When checked, they should fill entirely with Electric Blue. When unchecked, they remain a simple #333333 outline to minimize visual noise.