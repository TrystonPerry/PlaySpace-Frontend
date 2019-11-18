module.exports = {
  prefix: "",
  important: false,
  separator: ":",
  theme: {
    backgroundColor: theme => ({
      ...theme("colors"),
      primary: "#009dee",
      "black-100": "#999",
      "black-200": "#888",
      "black-300": "#777",
      "black-400": "#666",
      "black-500": "#555",
      "black-600": "#444",
      "black-700": "#333",
      "black-800": "#111",
      "black-900": "#000"
    }),
    borderColor: theme => ({
      ...theme("colors"),
      primary: "#009dee",
      white: "#fff"
    }),
    boxShadow: {
      default: "0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)",
      md:
        " 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06)",
      lg:
        " 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05)",
      xl:
        " 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, .25)",
      "3xl": "0 35px 60px -15px rgba(0, 0, 0, .3)",
      inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
      reg: "0px 3px 5px 5px rgba(0,0,0,0.125)",
      outline: "0 0 0 3px rgba(66,153,225,0.5)",
      focus: "0 0 0 3px rgba(66,153,225,0.5)",
      none: "none"
    },
    maxWidth: {
      "64": "16rem",
      "96": "24rem"
    },
    textColor: theme => ({
      ...theme("colors"),
      primary: "#009dee",
      white: "#fff"
    })
  },
  variants: {},
  plugins: []
}
