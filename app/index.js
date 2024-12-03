import { useState } from "react";

export default function Home() {
  const [secondSet, setSecondSet] = useState([]);

  const handleOptionChange = async (option) => {
    // Fetch data from the API
    const response = await fetch(`/api/options/${option}`);
    const data = await response.json();
    setSecondSet(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic Choice Boxes</h1>

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
          <img src="https://via.placeholder.com/150/92c952" alt="Option 1" style={{ width: "80%", borderRadius: "5px" }} />
          <p>This is Option 1</p>
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
            <input type="radio" name="choice" id="option1" onChange={() => handleOptionChange("option1")} />
            <label htmlFor="option1">Option 1</label>
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
          <img src="https://via.placeholder.com/150/771796" alt="Option 2" style={{ width: "80%", borderRadius: "5px" }} />
          <p>This is Option 2</p>
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
            <input type="radio" name="choice" id="option2" onChange={() => handleOptionChange("option2")} />
            <label htmlFor="option2">Option 2</label>
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
