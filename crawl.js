const crawl = async (url) => {
  try {
    console.log(url);
    if (seenUrls[url]) return;
    seenUrls[url] = true;
    console.log(url);
    const response = await fetch(url);
    const html = await response.text();

    //   break this loop if we saw this url

    //log links in the current page
    const $ = cheerio.load(html);

    const links = $("a")
      .map((i, anchor) => anchor.attribs.href)
      .get();

    //link could be google.com/xx/ff
    //link could be /xx/ff

    //host could be //google
    //host could be //amazon

    const { host, protocol } = urlParser.parse(url);

    links
      .filter((link) => link.includes(host))
      .forEach((link) => {
        console.log(link);
        crawl(getUrl(link, host, protocol));
      });

    //make this one seen after finishing looking
  } catch (error) {
    console.log(error);
  }
};

//get absolute url

//first input will be absolute => amazon.com/about
//next could be /contact
const getUrl = (link, host, protocol) => {
  if (link.includes("http")) {
    return link;
  } else if (link.startsWith("/")) {
    return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
};

// run the function
crawl(options.args[1]);
