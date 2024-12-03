"use client";
import { useState } from "react";


export default function Home() {
  const [secondSet, setSecondSet] = useState([]);

  const handleOptionChange = async (option) => {
    // Make a fetch request to the dynamic API route
    const response = await fetch(`/api/options/${option}`);
    const data = await response.json();
    setSecondSet(data);  // Set the data to render the next set of boxes
  };

  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Select Your Bundle</h1>

      {/* First Set of Boxes */}
      <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "20px" }}>
        <div
          style={{
            width: "200px",
            height: "250px",
            backgroundColor: "#fff",
            border: "2px solid #ccc",
            borderRadius: "10px",
            textAlign: "center",
            position: "relative",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img src="https://via.placeholder.com/150/92c952" alt="Magento" style={{ width: "80%", borderRadius: "5px" }} />
          <p>Magento</p>
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
            <input type="radio" name="choice" id="magento" onChange={() => handleOptionChange("magento")} />
            <label htmlFor="magento"></label>
          </div>
        </div>
        <div
          style={{
            width: "200px",
            height: "250px",
            backgroundColor: "#fff",
            border: "2px solid #ccc",
            borderRadius: "10px",
            textAlign: "center",
            position: "relative",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img src="https://via.placeholder.com/150/771796" alt="WordPress" style={{ width: "80%", borderRadius: "5px" }} />
          <p>WordPress</p>
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
            <input type="radio" name="choice" id="wordpress" onChange={() => handleOptionChange("wordpress")} />
            <label htmlFor="wordpress"></label>
          </div>
        </div>
      </div>

      {/* Second Set of Boxes */}
      <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
        {secondSet.map((item) => (
          <div
            key={item.id}
            style={{
              width: "150px",
              height: "200px",
              backgroundColor: "#fff",
              border: "2px solid #ccc",
              borderRadius: "10px",
              textAlign: "center",
              margin: "10px",
              padding: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img src={item.image} alt={item.title} style={{ width: "80%", borderRadius: "5px" }} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
