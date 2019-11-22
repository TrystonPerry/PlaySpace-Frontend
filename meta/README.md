This folder is for page meta info for each page. The strucutre is the same as the pages directory.

# You can use MetaTags.io to get the layout of basic Meta tags needed for development

Basic layout is like this:

Primary Meta Tags

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
<meta property="twitter:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png">
