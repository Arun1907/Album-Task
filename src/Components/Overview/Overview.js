import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Overview.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaEye } from "react-icons/fa";
import getSpotifyToken from "../../services/spotifyService";

const Overview = () => {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const token = await getSpotifyToken();
        if (!token) throw new Error("Failed to get Spotify token");

        const response = await axios.get(
          "https://api.spotify.com/v1/browse/new-releases?limit=15",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const albumPromises = response.data.albums.items.map(async (album) => {
          const albumDetails = await axios.get(
            `https://api.spotify.com/v1/albums/${album.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          
          const totalDurationMs = albumDetails.data.tracks.items.reduce(
            (acc, track) => acc + track.duration_ms,
            0
          );

          const totalMinutes = Math.floor(totalDurationMs / 60000);
          const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);
          const formattedDuration = `${totalMinutes} min ${totalSeconds} sec`;

          

          return {
            id: album.id,
            title: album.name,
            artist: album.artists.map((artist) => artist.name).join(", "),
            type: album.album_type,
            songCount: album.total_tracks,
            duration: formattedDuration,
            size: "N/A",
            releasedOn: album.release_date,
          };
        });

        const albumsData = await Promise.all(albumPromises);
        setAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setError("Failed to load albums.");
      }
      setLoading(false);
    };

    fetchAlbums();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTypes.length === 0 || selectedTypes.includes(album.type))
  );

  return (
    <>
      <h1 className="title">Overview</h1>
      <div className="container">
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              className="search-box"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="custom-dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              Type <IoIosArrowDown className="down-arrow" />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {["album", "single"].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      value={type}
                      onChange={() => handleTypeChange(type)}
                      checked={selectedTypes.includes(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <table className="album-table">
          <thead>
            <tr>
              <th>Collection Name</th>
              <th>Type</th>
              <th>Song Count</th>
              <th>Total Duration</th>
              <th>Total Size</th>
              <th>Released On</th>
              <th>Action</th>
            </tr>
            {loading ? <p>Loading albums...</p> : null}
            {error ? <p className="error">{error}</p> : null}
          </thead>
          <tbody>
            {filteredAlbums.map((album) => (
              <tr key={album.id}>
                <td>
                  {album.title}
                  <p style={{ fontSize: 12, color: "gray" }}>{album.artist}</p>
                </td>
                <td>{album.type}</td>
                <td>{album.songCount}</td>
                <td>{album.duration}</td>
                <td>{album.size}</td>
                <td>{album.releasedOn}</td>
                <td>
                  <Link
                    to={{
                      pathname: `/album/${album.id}`,
                      state: { albumSize: album.size }, // Pass the size to AlbumDetails
                    }}
                    className="view-link"
                  >
                    <FaEye /> View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Overview;
