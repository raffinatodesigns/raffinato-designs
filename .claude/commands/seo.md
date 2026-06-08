Audit the SEO on the page at $ARGUMENTS (or ask which file if not provided).

Read the HTML and check:

**On-page basics**
- `<title>` — present, 30-60 chars, includes primary keyword
- `<meta name="description">` — present, 120-160 chars, compelling
- One `<h1>` that matches the page topic
- `<h2>`/`<h3>` hierarchy logical and keyword-relevant
- Image `alt` attributes filled in and descriptive

**Technical**
- `<html lang="en">` present
- Canonical tag present (`<link rel="canonical">`)
- Robots meta tag (check it's not accidentally set to `noindex`)
- Page has a unique URL structure (flag if served from root with no clear slug)

**Structured data**
- Check for any existing JSON-LD schema
- Suggest relevant schema type if missing (LocalBusiness, WebPage, etc.)

**Social / Open Graph**
- `og:title`, `og:description`, `og:image` present
- Twitter card tags present

Output: prioritized findings with specific fixes. Include the exact code to add or change where relevant.
