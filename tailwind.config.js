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
      "black-900": "#000",
      "dark-5": "#4F4F4F",
      "dark-4": "#404040",
      "dark-3": "#383838",
      "dark-2": "#303030",
      "dark-1": "#202020"
    }),
    borderColor: theme => ({
      ...theme("colors"),
      primary: "#009dee",
      white: "#fff"
    }),
    borderRadius: {
      none: "0",
      sm: ".125rem",
      default: ".25rem",
      md: ".5rem",
      lg: "1rem",
      full: "9999px"
    },
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
    maxHeight: {
      "12": "3rem",
      "64": "16rem",
      "screen-90": "90vh",
      full: "100%"
    },
    maxWidth: {
      "48": "12rem",
      "64": "16rem",
      "96": "24rem",
      "128": "32rem"
    },
    minWidth: {
      "64": "16rem",
      full: "100%"
    },
    minHeight: {
      "screen-75": "75vh",
      screen: "100vh"
    },
    textColor: theme => ({
      ...theme("colors"),
      primary: "#009dee",
      "dark-5": "#4F4F4F",
      "dark-4": "#404040",
      "dark-3": "#383838",
      "dark-2": "#303030",
      "dark-1": "#202020",
      white: "#fff"
    })
  },
  variants: {},
  plugins: []
}
