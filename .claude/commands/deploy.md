Run a pre-deploy checklist on the site before pushing. Check $ARGUMENTS (or ask which HTML file/folder if not provided).

**Checklist:**

- [ ] No placeholder text (lorem ipsum, "TBD", "Coming Soon", "Your Name")
- [ ] No broken internal links (`href="#"` that aren't intentional anchors)
- [ ] All images have alt text
- [ ] Title and meta description filled in and unique per page
- [ ] Video files present and under 10MB
- [ ] Contact form action is set (not pointing to a dummy URL)
- [ ] Favicon and manifest present
- [ ] No console.log or debug code left in scripts
- [ ] Privacy policy and terms links work
- [ ] Mobile viewport meta tag present

Report each item as PASS / FAIL / WARN with a one-line note. Only flag actual problems — don't invent issues. If everything looks good, say so clearly.
