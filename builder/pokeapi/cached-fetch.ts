import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import slugify from "slugify";
import pLimit from "p-limit";

const cacheDir = path.join(__dirname, "../../.cache");
fs.mkdirSync(cacheDir, { recursive: true });

const limit = pLimit(2);

const get = async (url: string) => {
  const cacheFilename = path.join(
    cacheDir,
    url.replace("https://", "").replace(/\W/g, "-") + ".json"
  );

  if (fs.existsSync(cacheFilename))
    return JSON.parse(fs.readFileSync(cacheFilename).toString());

  return limit(() =>
    fetch(url)
      .then((res) => res.json())
      .then((x) => {
        fs.writeFileSync(cacheFilename, JSON.stringify(x));
        return x;
      })
  );
};

export default get;
