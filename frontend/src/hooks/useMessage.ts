import { useEffect, useState } from "react";

export function useMessage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3500")
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch message");
        setLoading(false);
      });
  }, []);

  return { message, loading, error };
}
