
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({
      error: "Server configuration missing"
    });
  }

  const pagePath =
    typeof req.body?.page_path === "string"
      ? req.body.page_path.slice(0, 200)
      : "/";

  if (!pagePath.startsWith("/")) {
    return res.status(400).json({
      error: "Invalid page path"
    });
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/page_views`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          page_path: pagePath
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        error: "Database request failed"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
