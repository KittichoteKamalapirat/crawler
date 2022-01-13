const fetch = require("node-fetch");
const { Command } = require("commander");
const cheerio = require("cheerio");
const urlParser = require("url");
const createWorker = require("./multiple-thread.js");
const { getUrl } = require("./functions");
const program = new Command();

//command line
program.version("0.0.1").description("Web Crawler for Links");
program.option("-n, --args [args...]", "Add args with optional type");
program.parse(process.argv);
const options = program.opts();

let maxWorkersNo = 1;
if (options.args === undefined) console.log("no args");
else if (options.args === true) console.log("add args");
else {
  // console.log(`add args type ${options.args[0]} and ${options.args[1]}`);
  maxWorkersNo = options.args[0];
}

//crawler
let seenUrls = {};
(async () => {
  try {
    const response = await fetch(options.args[1]);

    console.log(options.args[1]);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("a")
      .map((i, anchor) => anchor.attribs.href)
      .get();

    const { host, protocol } = urlParser.parse(options.args[1]);

    links
      .filter((link) => link.includes(host) && !link.includes(ignore))
      .forEach((link) => {
        createWorker(getUrl(url, host, protocol), maxWorkersNo, seenUrls);
      });
  } catch (error) {
    console.log(error);
  }
})();
