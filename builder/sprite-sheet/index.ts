import Jimp from "jimp";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { getArrayBuffer } from "../pokeapi/cached-fetch";
import { promisify } from "util";

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

type ImageSpec = {
  sheet: {
    box: { x: number; y: number; width: number; height: number };
    src: string;
    border: { top: number; left: number; right: number; bottom: number };
  };
  src: string;
};

export const generateSpriteSheet = async (
  imageUrls: string[],
  dir: string,
  prefix = ""
): Promise<Record<string, ImageSpec>> => {
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

      const buffer = await img.getBufferAsync("image/png");
      const hash = crypto.createHash("md5").update(buffer).digest("base64");
      const filename = hash.replace(/\W/g, "").slice(0, 16) + ".png";

      await promisify(fs.writeFile)(path.join(dir, filename), buffer);

      await img.crop(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

      return { img, src: prefix + filename, border, imageUrl };
    })
  );

  return Object.fromEntries(
    (
      await Promise.all(
        cut(sprites, 50).map(async (sprites) => {
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

            const [{ img, border, ...rest }] = sprites.splice(i, 1);

            set.push({
              ...rest,
              sheet: {
                border,
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

          const buffer = await composed.getBufferAsync("image/png");
          const hash = crypto.createHash("md5").update(buffer).digest("base64");
          const filename = hash.replace(/\W/g, "").slice(0, 16) + ".png";

          await promisify(fs.writeFile)(path.join(dir, filename), buffer);

          set.forEach((s) => {
            s.sheet.src = prefix + filename;
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
