import vue from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vue()],
	server: {
		open: true,
	},
});
