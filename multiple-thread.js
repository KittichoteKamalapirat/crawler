const urlParser = require("url");

const {
  Worker,
  isMainThread,
  parentPort,
  threadId,
  workerData,
} = require("worker_threads");
const { crawl, getUrl } = require("./functions.js");

//workers setup
let currentWorkersNo = 0;
if (isMainThread) {
  module.exports = (url, maxWorkersNo, seenUrls) => {
    if (currentWorkersNo < maxWorkersNo) {
      currentWorkersNo = currentWorkersNo + 1;
      return new Promise(async (resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: { url, seenUrls },
        });
        worker.on("message", (message) => {
          // console.log({ message });
        });
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
        worker.postMessage("message from main thread");
      });
    } else {
      return;
    }
  };
} else {
  const { host, protocol } = urlParser.parse(workerData.url);
  crawl(getUrl(workerData.url, host, protocol), workerData.seenUrls);
  parentPort.postMessage(workerData.seenUrls);
}
