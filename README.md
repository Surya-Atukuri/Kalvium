# Fieldnotes

Fieldnotes is a visual search app for finding images inspired by a topic, place, or feeling. Search results come from Wikimedia Commons, and the responsive image collection is styled like a printed field guide.

## Run locally

Open `index.html` in a browser. No build step or API key is required.

## Search states

- **Idle:** A hint invites you to search.
- **Loading:** A spinner and status message appear while images are fetched.
- **Results:** Matching images appear with a result count and a short fade-in.
- **Empty or error:** A helpful message appears when no images are available or the request fails.

Try a suggestion chip for a quick search. To verify the empty state, search for a made-up phrase; to verify the error state, disconnect from the network and search again.

## Deploy

This is a static site. Publish the repository root with GitHub Pages, Netlify, or Vercel; no build command or output directory is needed.
