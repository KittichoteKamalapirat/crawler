import fetch from "node-fetch";
import { Command } from "commander";
import cheerio from "cheerio";
import urlParser from "url";
const program = new Command();
program.version("0.0.1").description("Web Crawler for Links");

program.option("-n, --args [args...]", "Add args with optional type");

program.parse(process.argv);

const options = program.opts();
if (options.args === undefined) console.log("no args");
else if (options.args === true) console.log("add args");
else console.log(`add args type ${options.args[0]} and ${options.args[1]}`);

const seenUrls = {};

//crawler function
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
