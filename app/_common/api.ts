export async function apiPost<T>(
  url: string,
  body: any,
  setLoading: (loading: boolean) => void,
  callback: (data: T) => void
) {
  setLoading(true);
  try {
    const response = await fetch("/api" + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const json = await response.json();
      await callback(json as T);
    } else {
      console.error("Failed to fetch phrases");
    }
  } catch (error: unknown) {
    console.error("Error fetching phrases:", error);
  } finally {
    setLoading(false);
  }
}
