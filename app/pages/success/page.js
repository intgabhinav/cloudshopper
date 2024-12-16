"use client"; // Marks this as a client component

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter(); // For navigation

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "#28a745" }}>Success!</h1>
      <p>Your data has been successfully submitted.</p>
      <button
        onClick={() => router.push("/")} // Redirect to the home page
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back to Home
      </button>
    </div>
  );
}
