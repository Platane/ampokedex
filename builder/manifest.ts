import * as https from "https";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as crypto from "crypto";
import * as meta from "../service/package";
import { backgroundColor, themeColor } from "../components/_theme";
import jimp from "jimp";

const outDir = path.join(__dirname, "../build");
fs.mkdirSync(path.dirname(outDir), { recursive: true });

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ampokedex-image"));

const generateSizeVariant = async (
  url: string,
  sizes = [64, 128, 192, 256, 512]
) => {
  const originalFilename = path.join(tmpDir, url.replace(/\W/g, "") + ".png");

  await new Promise((resolve, reject) => {
    const req = https
      .request(url, (res) => {
        res.pipe(fs.createWriteStream(originalFilename));
        res.on("end", resolve);
        res.on("error", reject);
      })
      .on("error", reject);
    req.end();
  });

  const image = await jimp.read(originalFilename);

  return Promise.all(
    sizes.map(async (size) => {
      const i = await image.clone();

      await i.resize(size, size, jimp.RESIZE_NEAREST_NEIGHBOR);

      const buffer = await i.getBufferAsync("image/png");

      const hash = crypto.createHash("md5").update(buffer).digest("hex");

      const filename = "images/" + hash.slice(0, 16) + ".png";

      await i.writeAsync(path.join(outDir, filename));

      return { size, filename };
    })
  );
};

(async () => {
  const manifestContent = {
    short_name: meta.name,
    name: meta.name,
    description: meta.description,
    icons: (await generateSizeVariant(meta.logoUrl)).map(
      ({ size, filename }) => ({
        src: meta.baseUrl + "/" + filename,
        type: "image/png",
        sizes: `${size}x${size}`,
        purpose: "any maskable",
      })
    ),
    start_url: meta.baseUrl + "/",
    background_color: backgroundColor,
    display: "standalone",
    scope: meta.baseUrl + "/",
    theme_color: themeColor,
    shortcuts: [
      {
        name: "Pikachu",
        short_name: "Pikachu",
        description: "Pikachu entry",
        url: meta.baseUrl + "/pokemon/pikachu",
        icons: (
          await generateSizeVariant(
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          )
        ).map(({ size, filename }) => ({
          src: meta.baseUrl + "/" + filename,
          type: "image/png",
          sizes: `${size}x${size}`,
          purpose: "any maskable",
        })),
      },
    ],
  };

  fs.writeFileSync(
    path.join(outDir, "manifest.webmanifest"),
    JSON.stringify(manifestContent)
  );
})().catch(console.error);
