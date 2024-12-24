"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [secondSet, setSecondSet] = useState([]);
  const [selectedFirstOption, setSelectedFirstOption] = useState(null);
  const [selectedSecondSetOption, setSelectedSecondSetOption] = useState(null);
  const [inputFields, setInputFields] = useState([]);
  const [formData, setFormData] = useState({});

  const router = useRouter();

  const handleOptionChange = async (option) => {
    setSelectedFirstOption(option);

    try {
      const response = await fetch(`/api/options/${option}`);
      if (!response.ok) throw new Error("Failed to fetch options");
      const data = await response.json();
      setSecondSet(data);
      setSelectedSecondSetOption(null);
      setInputFields([]);
      setFormData({});
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
      setInputFields(data);
      setFormData({});
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
      const response = await fetch('/api/builder/order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      router.push(`/pages/review?id=${result.id}`);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to send data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-28">
      <h1 className="text-5xl mb-10 font-bold text-center">
        Welcome! Choose a Platform
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
        {/* Magento Card */}
        <div
          onClick={() => handleOptionChange("magento")}
          className="cursor-pointer bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <img
            src="https://www.mgt-commerce.com/astatic/assets/images/article/2023/310/hero.svg?v=1.0.3"
            alt="Magento"
            className="w-full h-32 object-contain"
          />
          <h2 className="mt-4 text-xl font-bold text-center">Magento</h2>
        </div>

        {/* WordPress Card */}
        <div
          onClick={() => handleOptionChange("wordpress")}
          className="cursor-pointer bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/Wordpress-Logo.svg"
            alt="WordPress"
            className="w-full h-32 object-contain"
          />
          <h2 className="mt-4 text-xl font-bold text-center">WordPress</h2>
        </div>
      </div>

      {/* Second Set of Options */}
      {secondSet.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mt-10">
          {secondSet.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSecondSetSelection(item.id)}
              className={`cursor-pointer bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition transform hover:-translate-y-1 ${
                selectedSecondSetOption === item.id ? "border-2 border-blue-500" : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-32 h-32 object-contain mx-auto"
              />
              <h2 className="mt-4 text-xl font-bold text-center">{item.title}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Input Fields */}
      {inputFields.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Additional Information</h2>
          <form>
            {inputFields.map((field) => (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className="block mb-2 font-medium">
                  {field.label}
                </label>
                {field.type === "dropdown" ? (
                  <select
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
      )}

      {/* Submit Button */}
      {inputFields.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
