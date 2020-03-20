import Vue from "vue"

const filters = {
  truncate: (str, length, ending = "...") => {
    if (!str) return
    let substr = str.substr(0, length)
    if (substr.length < str.length) {
      substr += ending
    }
    return substr
  },

  formatDate(date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]

    var d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear()

    return `${months[month]} ${day}, ${year}`
  }
}

for (const filter in filters) {
  Vue.filter(filter, filters[filter])
}
