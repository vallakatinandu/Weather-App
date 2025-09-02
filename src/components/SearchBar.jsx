import React from "react";

const SearchBar = ({ query, setQuery, onSearch }) => (
  <div className="search-bar">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter city (e.g., Mumbai)"
    />
    <button onClick={onSearch}>Search</button>
  </div>
);

export default SearchBar;
