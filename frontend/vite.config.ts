import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	envPrefix: "REACT_APP_",
	optimizeDeps: {
		exclude: [
			"chunk-PCU3LZFG.js?v=1fa386ac",
			"chunk-ZVKPOEJN.js?v=f50d0803",
			"chunk-ZJSYB3WR.js?v=79ac281b",
			"chunk-YQD5JGWU.js?v=cfb2bdf0",
			"chunk-SVBQQXXT.js?v=b40e65c5",
		],
	},
	server: {
		proxy: {
			"/api/today": {
				target: "https://zenquotes.io",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/today/, "/api/today"),
			},

			"/api/joke": {
				target: "https://v2.jokeapi.dev",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/joke/, "/joke/Programming?type=single"),
			},
		},
	},
});
