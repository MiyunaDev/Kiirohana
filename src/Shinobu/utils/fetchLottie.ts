async function fetchLottie(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load lottie");
  return res.json();
}

export default fetchLottie