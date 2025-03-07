import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import getSpotifyToken from "../../services/spotifyService";
import "./AlbumDetails.css";

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackSizes, setTrackSizes] = useState([]);

  useEffect(() => {
    const fetchAlbumFromSpotify = async () => {
      setLoading(true);
      const token = await getSpotifyToken();

      if (!token) {
        console.error("Failed to get Spotify access token");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/albums/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAlbum(response.data);

        const sizes = response.data.tracks.items.map(() => 
          Math.floor(Math.random() * (25 - 10 + 1) + 10) 
        );

        setTrackSizes(sizes);
      } 
      catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumFromSpotify();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!album) return <p>Album not found</p>;

  const totalDurationMs = album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms,
    0
  );

  const totalMinutes = Math.floor(totalDurationMs / 60000);
  const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);

  
  const totalSizeMB = trackSizes.reduce((sum, size) => sum + size, 0);

  return (
    <div className="album-details-container">
    <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Overview</Link> &gt; 
        <span className="breadcrumb-current">{album.name}</span>
      </div>
      <h1 className="album-title">{album.name}</h1>

      
      <div className="album-info-row">
        {/* <img
          src={album.images[0]?.url}
          alt={album.name}
          className="album-small-cover"
        /> */}
        <div className="album-info-text">
          <div><strong>Artist</strong> <br/> {album.artists.map(artist => artist.name).join(", ")}</div>
          <div><strong>Type</strong> <br/> {album.album_type}</div>
          <div><strong>Song Count</strong> <br/> {album.total_tracks}</div>
          <div><strong>Total Size</strong> <br/> {totalSizeMB} MB</div>
          <div><strong>Total Duration</strong> <br/> {totalMinutes} min {totalSeconds} sec</div>
          <div><strong>Released On</strong> <br/> {album.release_date}</div>
        </div>
      </div>

     
      <table className="song-table">
        <thead>
          <tr>
            <th>Song</th>
            <th>Performers</th>
            <th>Duration</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {album.tracks.items.map((track, index) => (
            <tr key={index}>
              <td>{track.name}</td>
              <td>{track.artists.map(artist => artist.name).join(", ")}</td>
              <td>{new Date(track.duration_ms).toISOString().substr(14, 5)}</td>
              <td>{trackSizes[index]} MB</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div className="back-button-container">
        <Link to="/" className="back-link">Back</Link>
      </div>
    </div>
  );
};

export default AlbumDetails;
