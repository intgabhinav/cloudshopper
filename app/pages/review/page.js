"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // New fetching state

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (!id) {
        setError("ID not provided");
        setFetching(false);
        return;
      }

      try {
        const filter = JSON.stringify({ _id: id });
        const response = await fetch(`/api/crud?collectionName=orders&filter=${encodeURIComponent(filter)}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        if (!result || Object.keys(result).length === 0) {
          throw new Error("No data found for this ID");
        }

        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [searchParams.toString()]); // Avoid unnecessary re-fetches

  const handleSubmit = async () => {
    const id = searchParams.get("id");
    if (!id) {
      alert("Invalid ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: id }),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      if (!result.id) throw new Error("Invalid response from server");

      router.push(`/pages/success?id=${result.id}`);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.message || "Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleRecreate = async () => {
    const id = searchParams.get("id");
    if (!id) {
      alert("Invalid ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: id }),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      if (!result.id) throw new Error("Invalid response from server");

      router.push(`/pages/success?id=${result.id}`);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.message || "Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          onClick={handleRecreate}
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
          {loading ? "Recreating..." : "Recreate"}
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
