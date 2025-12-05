/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // SỬA DÒNG NÀY: Thêm dấu nháy và đổi tên
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
};

export default config;