const colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			screens: {
				xs: { max: "425px" },
				sm: { max: "768px" },
				'max-lg': { max: "1024px" }
			},
			animation: {
				"animate-alt-spin": "spin 1s linear infinite reverse",
				"spin-slow": "spin 3s linear infinite",
			},
			height: {
				'154': '38rem',
			}
		},
		fontFamily: {
			sora: ["'Sora'"],
			urbanist: ["'Urbanist'"],
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: colors.trueGray,
			indigo: colors.indigo,
			red: colors.rose,
			yellow: colors.amber,
			blue: colors.blue,
			green: colors.green,
			pizza: "#FF8906",
			cryptoblue: "#4065F6",
			faintblue: "#F2F5FF",
			twitterblue: "#1DA1F2",
			cryptopurple: "#9366F9",
			lightpurple: "#F6F2FF",
			footerblack: "#16161A",
			"heading-color": "var(--heading-color)",
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
