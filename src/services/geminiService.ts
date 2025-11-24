export async function generateIA(prompt: string) {
    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
    }

    return await res.json();
}
