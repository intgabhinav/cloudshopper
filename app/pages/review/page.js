"use client"; // Marks this as a client component
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const searchParams = useSearchParams(); // To get query parameters
  const router = useRouter(); // For navigation
  const [data, setData] = useState(null); // To store fetched data
  const [error, setError] = useState(null); // To handle errors
  const [loading, setLoading] = useState(false); // To show loading on submit

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id"); // Get the `id` from the query parameter
      if (!id) {
        setError("ID not provided");
        return;
      }

      try {
        const filter = JSON.stringify({ _id: id });
        const response = await fetch(`/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unexpected error occurred");
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSubmit = async () => {
    const id = searchParams.get("id");
    setLoading(true);
    try {
      const response = await fetch("/api/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }), // Pass the fetched data
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      console.log("Response:", result);

      // Navigate to the success page with the ID
      router.push(`/pages/success?id=${result.id}`);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Review Page</h1>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#c0c0c0" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
