const randomColors = [
  "#FFD700", // Bright Yellow
  "#FF8C00", // Citrus Orange
  "#FF6347", // Coral Red
  "#FF00FF", // Magenta
  "#8A2BE2", // Electric Violet
  "#4169E1", // Royal Blue
  "#00BFFF", // Sky Blue
  "#2E8B57", // Emerald Green
  "#008080", // Teal
  "#FF1493", // Bright Pink
  "#4B0082", // Indigo
  "#FF6B6B", // Sunset Orange
  "#FF8A65", // Vivid Coral
  "#29B6F6", // Bright Cerulean
  "#00BFFF", // Deep Sky Blue
  "#32CD32", // Lime Green
  "#8A2BE2", // Electric Violet
  "#DC143C", // Crimson Red
  "#DAA520", // Goldenrod
  "#FF69B4", // Hot Pink
  "#40E0D0", // Turquoise
  "#4169E1", // Royal Blue
];

export const randomColor = (initials: string) => {
  if (!initials || initials.length < 2) return randomColors[0];
  const firstLetter = initials[0].toUpperCase();
  const secondLetter = initials[1].toUpperCase();
  const combinedCode = firstLetter.charCodeAt(0) + secondLetter.charCodeAt(0);
  const colorIndex = combinedCode % randomColors.length;

  return randomColors[colorIndex];
};
