import { useEffect, useState } from "react";
import { getJobStatus } from "../api/spots";

export default function GeocodeJobStatus({ jobUrl }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getJobStatus(jobUrl);
      setStatus(data.status);
      if (data.status === "complete") clearInterval(interval);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="mt-2">
      Job Status: <strong>{status}</strong>
    </p>
  );
}
