const fetch = require("node-fetch");
const cheerio = require("cheerio");
const urlParser = require("url");

const getUrl = (link, host, protocol) => {
  if (link.includes("http")) {
    return link;
  } else if (link.startsWith("/")) {
    return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
};

//crawler function
const crawl = async (url, seenUrls) => {
  try {
    if (seenUrls[url]) return;
    console.log(url);
    seenUrls[url] = true;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("a")
      .map((i, anchor) => anchor.attribs.href)
      .get();
    const { host, protocol } = urlParser.parse(url);

    links
      .filter((link) => link.includes(host))
      .forEach((link) => {
        crawl(getUrl(link, host, protocol), seenUrls);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUrl,
  crawl,
};
