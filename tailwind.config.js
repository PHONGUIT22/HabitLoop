/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6366F1", // Màu chủ đạo (nút bấm, highlight)
          secondary: "#8B5CF6",
          dark: "#0A0A0C", // Nền tối sâu (thay vì đen xám gốc)
          card: "#141419", // Nền các ô habit card
          border: "#23232A", // Đường viền mỏng
          muted: "#71717A", // Chữ mờ phụ
        },
      },
    },
  },
  plugins: [],
};