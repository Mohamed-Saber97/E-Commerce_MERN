export const apiFetch = async (url : string, options: RequestInit) => {
    const response = await fetch(url, options);
    if(!response.ok) {
        throw new Error("Api request Failed");
    }
    return response.json();
}