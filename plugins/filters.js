import Vue from "vue"

const filters = {
  truncate: (str, length, ending = "...") => {
    if (!str) return
    let substr = str.substr(0, length)
    if (substr.length < str.length) {
      substr += ending
    }
    return substr
  }
}

for (const filter in filters) {
  Vue.filter(filter, filters[filter])
}
