import axios from "axios";

const CLIENT_ID = "88f0876abfdd4f30b64e05eed0bc0fce";
const CLIENT_SECRET = "732cd55593234840b2a1f33d977046c6";

const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Spotify token:", error.response?.data || error.message);
    return null;
  }
};

export default getSpotifyToken;
