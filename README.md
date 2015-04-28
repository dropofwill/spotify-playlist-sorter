# upm-ui

Prototype exploring the UI for a Universal Playlist Manager app


## Run locally

Requires node and npm

Clone this repo then:

```
npm install
```

Add your Spotify app credentials as environment variables. For example if you are using bash or zsh add to ~/.bashrc or ~/.zshrc:

```
export SPOTIFY_CLIENT_ID='your_client_id'
export SPOTIFY_CLIENT_SECRET='your_client_secret'
```

Start the server:

```
node back/lib/app.js
```

And point your browser to 0.0.0.0:3000
