# KRINGLE

Kramer's Robotically Imposed Novel Gift Linking Engine. A static gift-exchange
draw that runs entirely in the browser. It has no server and no database.

## Files

- `index.html`: organizer page (names, Jeanne Mode, draw, links)
- `reveal.html`: shows one person their recipient, decoded from the link's `#` part
- `kringle-codec.js`: encodes and decodes the reveal links
- `style.css`: shared styles

## Publish on GitHub Pages

1. Push this folder to a public GitHub repository, for example `kringler`.
2. In the repository, go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**,
   pick `main` and `/ (root)`, then click **Save**.
4. The site appears at `https://<username>.github.io/kringler/`.

## Sending links

After a draw, each person's row has a **Send** button. On devices with a
system share menu (most phones), it opens that menu so the organizer can send
the link by Mail, Messages, or any other app. Elsewhere, it opens the default
email app with a prefilled subject and message. The message contains only the
link, never the recipient's name. Mail goes out from the organizer's own
account; KRINGLE has no sending service of its own.

## Notes

- Reveal links are obfuscated, not encrypted. Anyone who has a link and this
  code can decode it.
- The draw is lost on page refresh. Links already copied keep working because
  each link carries its own result.
- Jeanne Mode rules apply only while Jeanne Mode is on. Turning it off keeps
  the entries but ignores them during the draw.
