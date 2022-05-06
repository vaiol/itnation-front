### How to start
1. `npm install`
2. `npm run start:backend`
3. Open `public/index.html`

### Change engine
Change script line in `public/index.html`:
- Without persistence - ```<script src="../src/scripts/chat-engine.js"></script>```
- LocalStorage persistence - ```<script src="../src/scripts/chat-engine-local.js"></script>```
- With backend persistence - ```<script src="../src/scripts/chat-engine-http.js"></script>```