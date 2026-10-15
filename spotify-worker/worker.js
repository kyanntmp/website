/* Optional: your own "now playing" service for the Spotify card.
   It runs for free on Cloudflare Workers. Setup steps are in LISEZMOI.txt.

   Variables to add in Cloudflare (Settings > Variables, use "Encrypt" for the first three):
     SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
     ALLOWED_ORIGIN   the address of your site, for example https://your-name.github.io

   It answers with JSON:
     { "isPlaying": false }
     { "isPlaying": true, "title": "...", "artist": "...", "album": "...", "albumArt": "https://...",
       "trackId": "...", "progressMs": 12345, "durationMs": 215000 } */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowOrigin = env.ALLOWED_ORIGIN && origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN || "*";
    const headers = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { ...headers, "Access-Control-Allow-Methods": "GET", "Access-Control-Max-Age": "86400" } });
    }

    const nothing = () => new Response(JSON.stringify({ isPlaying: false }), { headers });

    try {
      // 1. Trade the refresh token for a short-lived access token
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN })
      });
      const { access_token } = await tokenResponse.json();
      if (!access_token) return nothing();

      // 2. Ask Spotify what is playing
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: "Bearer " + access_token }
      });
      if (response.status === 204 || response.status >= 400) return nothing();

      const data = await response.json();
      const item = data.item;
      if (!data.is_playing || !item || data.currently_playing_type !== "track") return nothing();

      const images = (item.album && item.album.images) || [];
      return new Response(JSON.stringify({
        isPlaying: true,
        title: item.name,
        artist: item.artists.map((artist) => artist.name).join(", "),
        album: item.album ? item.album.name : "",
        albumArt: (images[1] || images[0] || {}).url || "",
        trackId: item.id,
        progressMs: data.progress_ms,
        durationMs: item.duration_ms
      }), { headers });
    } catch (error) {
      return nothing();
    }
  }
};
