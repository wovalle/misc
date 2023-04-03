import { useState, FC } from "react";

const Headers: FC<{ path: string; children: string }> = ({
  path,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>({
    path,
    latency: null,
    status: null,
    headers: {
      "X-upstash-latency": "",
      "X-RateLimit-Limit": "",
      "X-RateLimit-Remaining": "",
      "X-RateLimit-Reset": "",
    },
    data: null,
  });

  const handleFetch = async () => {
    const start = Date.now();
    setLoading(true);

    try {
      const res = await fetch(path);
      setState({
        path,
        latency: `~${Math.round(Date.now() - start)}ms`,
        status: `${res.status}`,
        headers: {
          "x-real-ip": `${res.headers.get("x-real-ip")}`,
          "x-forwarded-for": res.headers.get("x-forwarded-for"),
          "x-vercel-forwarded-for": res.headers.get("x-vercel-forwarded-for"),
          "x-vercel-ip-country": res.headers.get("x-vercel-ip-country"),
          "x-vercel-ip-latitude": res.headers.get("x-vercel-ip-latitude"),
          "x-vercel-ip-longitude": res.headers.get("x-vercel-ip-longitude"),
          "x-vercel-ip-timezone": res.headers.get("x-vercel-ip-timezone"),
        },
        data: res.headers.get("Content-Type")?.includes("application/json")
          ? await res.json()
          : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button onClick={handleFetch}>{children}</button>
      <pre
        className={`border border-accents-2 rounded-md bg-white overflow-x-auto p-6 transition-all ${
          loading ? ` opacity-50` : ""
        }`}
      >
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default Headers;
