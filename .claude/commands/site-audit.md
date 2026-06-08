Audit the HTML file at $ARGUMENTS (or ask me which file if not provided).

Check and report on:

**SEO**
- Title tag (present, under 60 chars, descriptive)
- Meta description (present, under 160 chars)
- H1 present and unique
- Image alt attributes

**Performance**
- Any video or image files referenced — flag if likely oversized
- Render-blocking scripts or stylesheets
- Missing `loading="lazy"` on below-fold images

**Accessibility**
- Buttons and links have descriptive labels
- Form inputs have associated labels
- Color contrast issues (flag any inline styles)
- `lang` attribute on `<html>`

**General**
- Broken or placeholder links (`href="#"`, `href=""`)
- Missing favicon or manifest
- Open Graph / social meta tags

Output a prioritized list: Critical → Should Fix → Nice to Have.
