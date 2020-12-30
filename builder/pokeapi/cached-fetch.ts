import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import pLimit from "p-limit";

const cacheDir = path.join(__dirname, "../../.cache");
fs.mkdirSync(cacheDir, { recursive: true });

const limit = pLimit(1);

export const getJson = async (url: string) => {
  const cacheFilename = path.join(
    cacheDir,
    url.replace("https://", "").replace(/\W/g, "-") + ".json"
  );

  if (fs.existsSync(cacheFilename))
    return JSON.parse(fs.readFileSync(cacheFilename).toString());

  return limit(() =>
    wait(200)
      .then(() => fetch(url))
      .then((res) => res.json())
      .then((x) => {
        fs.writeFileSync(cacheFilename, JSON.stringify(x));
        return x;
      })
  );
};

export const getArrayBuffer = async (url: string) => {
  const cacheFilename = path.join(
    cacheDir,
    url.replace("https://", "").replace(/\W/g, "-")
  );

  if (fs.existsSync(cacheFilename)) return fs.readFileSync(cacheFilename);

  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((x) => {
      fs.writeFileSync(cacheFilename, Buffer.from(x));
      return x;
    });
};

const wait = (delay = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));
