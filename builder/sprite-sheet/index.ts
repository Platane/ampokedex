import Jimp from "jimp";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { getArrayBuffer } from "../pokeapi/cached-fetch";
import { promisify } from "util";
import { execFile } from "child_process";
// @ts-ignore
import cwebp from "cwebp-bin";

const getBox = (img: Jimp) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const { x, y, idx } of img.scanIterator(
    0,
    0,
    img.getWidth(),
    img.getHeight()
  )) {
    const alpha = img.bitmap.data[idx + 3];

    if (alpha > 0) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

const cut = <T>(arr: T[], n: number) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, (i + 1) * n)
  );

export type Sources = { src: string; type: "image/png" | "image/webm" }[];
export type ImageSpec = {
  sheet: {
    box: { x: number; y: number; width: number; height: number };
    sources: Sources;
  };
  border: { top: number; left: number; right: number; bottom: number };
  sources: Sources;
};

const writeImage = async (img: Jimp, dir: string, prefix = "") => {
  const pngBuffer = await img.getBufferAsync("image/png");
  const pngHash = crypto
    .createHash("md5")
    .update(pngBuffer)
    .digest("base64")
    .replace(/\W/g, "")
    .slice(0, 16);

  const pngFilename = path.join(dir, pngHash + ".png");

  await promisify(fs.writeFile)(pngFilename, pngBuffer);

  await promisify(execFile)(cwebp, [
    pngFilename,
    "-lossless",
    // "-q",
    // "100",
    "-o",
    pngFilename.replace(".png", ".webp"),
  ]);

  return [
    {
      type: "image/webm",
      src: prefix + pngHash + ".webp",
    },
    {
      type: "image/png",
      src: prefix + pngHash + ".png",
    },
  ];
};

export type ImageSpecs = Record<string, ImageSpec>;
export const generateSpriteSheet = async (
  imageUrls: string[],
  dir: string,
  prefix = ""
): Promise<ImageSpecs> => {
  fs.mkdirSync(dir, { recursive: true });

  const sprites = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const img = await Jimp.read((await getArrayBuffer(imageUrl)) as any);
      const cropBox = getBox(img);

      const originalBox = {
        width: img.getWidth(),
        height: img.getHeight(),
        x: 0,
        y: 0,
      };

      const border = {
        top: cropBox.y,
        left: cropBox.x,
        right: originalBox.width - (cropBox.width + cropBox.x),
        bottom: originalBox.height - (cropBox.height + cropBox.y),
      };

      const sources = await writeImage(img, dir, prefix);

      await img.crop(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

      return { img, sources, border, imageUrl };
    })
  );

  const w = 512;
  const averageArea =
    sprites.reduce((s, { img }) => s + img.getHeight() * img.getWidth(), 0) /
    sprites.length;
  const n = Math.floor(((w * w) / averageArea) * 0.9);

  return Object.fromEntries(
    (
      await Promise.all(
        cut(sprites, n).map(async (sprites) => {
          sprites.sort((a, b) => b.img.getHeight() - a.img.getHeight());

          const w = 512;
          const h =
            sprites.reduce(
              (s, { img }) => s + img.getWidth() * img.getHeight(),
              0
            ) / w;
          const composed = await createJimpImage(w + 2, h * 2);

          let x = 0;
          let y = 0;
          let my = 0;

          const set = [] as any[];

          while (sprites.length) {
            const r = w - x;

            let i = sprites.findIndex(({ img }) => img.getWidth() <= r);

            if (i === -1) {
              x = 0;
              y += my;
              my = 0;
              i = 0;
            }

            const [{ img, ...rest }] = sprites.splice(i, 1);

            set.push({
              ...rest,
              sheet: {
                box: {
                  x,
                  y,
                  width: img.getWidth(),
                  height: img.getHeight(),
                },
              },
            });

            composed.composite(img, x + 1, y + 1);
            x += img.getWidth();
            my = Math.max(img.getHeight(), my);
          }

          composed.autocrop();

          const sources = await writeImage(composed, dir, prefix);

          set.forEach((s) => {
            s.sheet.sources = sources;
          });

          return set;
        })
      )
    )
      .flat()
      .map(({ imageUrl, ...x }) => [imageUrl, x as ImageSpec])
  );
};

const createJimpImage = (width: number, height: number): Promise<Jimp> =>
  new Promise((resolve, reject) => {
    new Jimp(width, height, function (err: any) {
      if (err) reject(err);
      else resolve(this);
    });
  });
