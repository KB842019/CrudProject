import axios from "axios";
import React, { useState } from "react";

const UseRefVsUseState = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  console.log("render");

  const fetchDatas = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setData(response.data);
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  // Filter data directly from search input
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Fetch + Search Example (No Debounce)</h1>

      <button onClick={fetchDatas}>Fetch Data</button>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        {filteredData.map((item) => (
          <h3 key={item.id}>
            {item.name}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default UseRefVsUseState;
