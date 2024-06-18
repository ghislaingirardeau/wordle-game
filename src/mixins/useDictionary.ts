export async function useFrenchDictionary(
  loader: { value: boolean },
  word: string
) {
  loader.value = true;
  const url = import.meta.env.VITE_dicolink_url + word + "/definitions";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_x_rapidapi_key,
      "x-rapidapi-host": import.meta.env.VITE_x_rapidapi_host,
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    loader.value = false;
    return result[0].definition;
  } catch (error) {
    console.error(error);
    return "Impossible de récupérer la définition";
  }
}
