"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [secondSet, setSecondSet] = useState([]);
  const [selectedFirstOption, setSelectedFirstOption] = useState(null); // Track first selection
  const [selectedSecondSetOption, setSelectedSecondSetOption] = useState(null); // Track second selection
  const [inputFields, setInputFields] = useState([]); // Store dynamically generated input fields
  const [formData, setFormData] = useState({}); // Store values of input fields

  const router = useRouter(); // For navigation

  const handleOptionChange = async (option) => {
    setSelectedFirstOption(option);

    try {
      const response = await fetch(`/api/options/${option}`);
      if (!response.ok) throw new Error("Failed to fetch options");
      const data = await response.json();
      setSecondSet(data); // Set the data to render the next set of boxes
      setSelectedSecondSetOption(null); // Reset selection
      setInputFields([]); // Reset input fields
      setFormData({}); // Reset form data
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSecondSetSelection = async (itemId) => {
    setSelectedSecondSetOption(itemId);

    try {
      const response = await fetch(`/api/options/${itemId}`);
      if (!response.ok) throw new Error("Failed to fetch input fields");
      const data = await response.json();
      setInputFields(data); // Update input fields based on the response
      setFormData({}); // Reset form data
    } catch (error) {
      console.error(error);
      alert("Unable to fetch input fields. Please try again.");
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      bundle: selectedFirstOption,
      plan: selectedSecondSetOption,
      inputFields: formData,
    };
  
    try {
      const response = await fetch(`/api/builder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      //if (!response.ok) throw new Error("Failed to create AWS resources");
      const result = await response.json();
      console.log("Response0:", result);
  
      console.log("Received ID0:", result.ids[0]); // Debugging log
      if (result.ids[0]) {
        router.push(`/pages/review?id=${result.ids[0]}`);
        //router.push(`/review?id=6754c0b8491a992e53b9c0e2`);
      } else {
        console.error("No ID returned from the API");
        alert("Failed to fetch the order ID.");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to send data. Please try again.");
    }
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
            <div style={{ marginTop: "10px" }}>
              <input
                type="radio"
                name="secondSetChoice"
                id={item.id}
                checked={selectedSecondSetOption === item.id}
                onChange={() => handleSecondSetSelection(item.id)}
              />
              <label htmlFor={item.id}></label>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamically Generated Input Fields */}
      <div style={{ marginTop: "20px" }}>
        {inputFields.length > 0 && (
          <form>
            <h2>Additional Information</h2>
            {inputFields.map((field) => (
              <div key={field.id} style={{ marginBottom: "10px" }}>
                {field.type === "dropdown" ? (
                  <>
                    <label htmlFor={field.id} style={{ display: "block", marginBottom: "5px" }}>
                      {field.label}
                    </label>
                    <select
                      id={field.id}
                      name={field.name}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label htmlFor={field.id} style={{ display: "block", marginBottom: "5px" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </form>
        )}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
