# Spotlight Accordion

An interactive accordion component for Framer with a cursor-following spotlight, focused-row emphasis, ambient glow, smooth expansion, and extensive visual controls.

[![Framer](https://img.shields.io/badge/Built%20for-Framer-0099FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/)
[![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)

## ✨ Overview

**Spotlight Accordion** turns a familiar FAQ pattern into a more expressive interaction.

Move the pointer across the component and a soft spotlight follows it. The closest row becomes the visual focus while surrounding rows subtly dim and blur. Opening an item reveals its answer with a smooth height animation while the plus icon rotates into a minus.

It is designed for portfolios, agency sites, SaaS landing pages, product pages, creative websites, FAQs, and Framer projects where a standard accordion feels too static.

## 🔗 Links

- **Live Preview:** https://spotlightaccordion.framer.website/?editSite
- **Framer:** https://www.framer.com/
- **X:** https://x.com/karimsaif0
- **Email:** mailto:karimsaif010@gmail.com

## 🎯 Features

- Cursor-following radial spotlight
- Automatic nearest-row focus detection
- Focused row scaling
- Ambient cursor glow
- Configurable dimming outside the spotlight
- Optional spotlight blur
- Smooth accordion open and close transitions
- Single-open and multiple-open modes
- Animated plus/minus icon
- Optional numbered questions
- Responsive container-based sizing
- Touch/coarse-pointer fallback
- Reduced-motion support
- Static-renderer protection for Framer
- Keyboard support with Enter and Space
- ARIA expanded/controls states
- Up to 20 custom accordion items
- Extensive Framer property controls
- Stable layout width while answers open

## 🧩 How It Works

### Spotlight interaction

On supported pointer devices, the cursor position is tracked relative to the component. The spotlight and ambient glow are rendered from that position.

The component calculates which accordion row is closest to the pointer. That row receives the strongest visual treatment while surrounding rows become quieter.

### Accordion interaction

Click a question to toggle its answer. Keyboard users can focus the question and use **Enter** or **Space**.

With **Single** mode enabled, opening one item closes the previously opened item. With **Multiple** mode, several answers can remain open at the same time.

### Visual width expansion

The open-width effect uses a visual `scaleX` transform instead of changing the row's actual CSS width.

Every row remains at `width: 100%`, which keeps the component's layout width stable when an answer opens.

## 🎨 Framer Controls

### Content

**Items**
- Add up to 20 questions and answers.
- Edit question and answer copy directly in Framer.

### Layout & Typography

- Background
- Text color
- Answer color
- Border color
- Radius
- Border width
- Row gap
- Padding
- Question size
- Answer size
- Question weight
- Answer line height

### Spotlight

- Spotlight size
- Spotlight intensity
- Spotlight blur
- Spotlight color
- Cursor spotlight toggle
- Dim opacity

### Glow

- Glow color
- Glow intensity

### Motion

- Hover scale
- Active scale
- Open width
- Animation duration
- Single or multiple open mode

### UI Details

- Show/hide numbers
- Number color
- Number size
- Icon color
- Icon size
- Click-to-open toggle

## 📱 Responsive & Touch Behavior

The component uses its container width rather than a fixed viewport size.

On coarse-pointer devices, the cursor spotlight interaction is disabled so the accordion remains clean and usable on touch screens. The accordion itself remains interactive.

## ♿ Accessibility

Spotlight Accordion includes interaction details intended to keep the component usable beyond pointer interaction:

- Keyboard focus for interactive questions
- Enter and Space toggling
- `aria-expanded` state
- `aria-controls` relationship between question and answer
- Decorative spotlight layers marked as hidden from assistive technology
- Reduced-motion handling through Motion's reduced-motion preference

The visual spotlight is an enhancement; the accordion content does not depend on the spotlight to function.

## ⚡ Performance

Cursor position updates are throttled through `requestAnimationFrame` rather than updating React state for every raw pointer event.

The component also:

- Cleans up the animation frame on unmount
- Uses `ResizeObserver` for container measurements
- Cleans up the resize observer
- Detects coarse pointer devices
- Avoids continuous cursor animation in static rendering
- Respects reduced-motion preferences
- Keeps row layout width stable during the open-width effect

## 🛠️ Installation

This repository contains the Framer Code Component source.

1. Open your Framer project.
2. Create or import a Code Component.
3. Add the contents of `SpotlightAccordion.tsx`.
4. Make sure the project has access to `motion/react` and Framer's component APIs.
5. Insert the component on the canvas.
6. Customize the controls in the properties panel.

## 📁 File Structure

```
Spotlight-Accordion/
├── SpotlightAccordion.tsx
├── README.md
└── LICENSE
```

## 💡 Suggested Use Cases

### Portfolio websites
Project FAQs, process sections, service details, and case-study information.

### Agency websites
Services, capabilities, process steps, or common questions.

### SaaS landing pages
Pricing questions, feature explanations, onboarding information, and product FAQs.

### Creative websites
The combination of cursor lighting, focus, blur, and motion works especially well with dark visual systems.

### Product pages
Keep supporting information compact while giving the interaction a more designed feel.

## 🎛️ Customization Tips

### Subtle
- Lower spotlight intensity.
- Reduce dim opacity.
- Keep glow intensity low.
- Keep scaling close to 1.

### Cinematic
- Increase spotlight size.
- Add more glow.
- Increase focused-row scaling slightly.
- Use stronger border contrast.
- Give the open row a little more visual width.

### Minimal FAQ
- Disable numbers.
- Set glow intensity near zero.
- Use a smaller border width.
- Keep the spotlight soft and low contrast.

## 🧠 Design Philosophy

Spotlight Accordion is built around a simple idea:

> Focus should follow attention.

Instead of treating every accordion row equally, the component creates visual hierarchy around the user's current position. The interaction stays familiar, but the interface responds to attention.

The result is an accordion that feels more dimensional without requiring a complicated 3D or canvas-based implementation.

## 📦 Framer-Friendly Architecture

The component is structured for Framer Code Component workflows with:

- Framer property controls
- Static-renderer detection
- Reduced-motion support
- Responsive layout support
- Cleanup for observers and animation frames
- Keyboard interaction
- Accessible state attributes
- Container-aware measurements
- No external runtime dependency beyond Framer and Motion

## 🤝 Support

Built and maintained by **Karim Saif**.

- X: https://x.com/karimsaif0
- Email: mailto:karimsaif010@gmail.com

For bugs or improvement ideas, open an issue in this repository.

---

Made with 💛 by Karim Saif  
Created and customized for Framer by Karim Saif
