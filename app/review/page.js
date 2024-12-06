"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Review() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  console.log("Review data:", data);

  // Parse data
  const parsedData = JSON.parse(data);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Review Your Submission</h1>
      <pre style={{ backgroundColor: "#f8f8f8", padding: "10px", borderRadius: "5px" }}>
        {JSON.stringify(parsedData, null, 2)}
      </pre>
    </div>
  );
}
