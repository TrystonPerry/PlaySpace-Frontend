const propFormat = (property, content) => ({ hid: property, property, content })

module.exports = d => {
  const r = { meta: [] }
  if (d.title) {
    r.title = d.title
    r.meta.push({ hid: "title", name: "title", content: d.title })
    r.meta.push(propFormat("og:title", d.title))
    r.meta.push(propFormat("twitter:title", d.title))
  }
  if (d.desc) {
    r.meta.push({ hid: "description", name: "description", content: d.desc })
    r.meta.push(propFormat("og:description", d.desc))
    r.meta.push(propFormat("twitter:description", d.desc))
  }
  if (d.url) {
    r.meta.push(propFormat("og:url", `https://playspace.tv${d.url}`))
    r.meta.push(propFormat("twitter:url", `https://playspace.tv${d.url}`))
  }
  if (d.img) {
    r.meta.push(propFormat("og:image", d.img))
    r.meta.push(propFormat("twitter:image", d.img))
  }
  return r
}

/*

data = {
  title:
  desc:
  url:
  img:
}

<!-- Primary Meta Tags -->
<title>${data.username} - PlaySpace</title>
<meta name="title" content="${data.username} - PlaySpace">
<meta name="description" content="Watch ${data.username}'s streams on PlaySpace ">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://metatags.io/">
<meta property="og:title" content="${data.username} - PlaySpace">
<meta property="og:description" content="Watch ${data.username}'s streams on PlaySpace ">
<meta property="og:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://metatags.io/">
<meta property="twitter:title" content="${data.username} - PlaySpace">
<meta property="twitter:description" content="Watch ${data.username}'s streams on PlaySpace ">
<meta property="twitter:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"></meta>
*/
