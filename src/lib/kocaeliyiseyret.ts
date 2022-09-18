import { load as loadDOM } from "cheerio";

const KOCAELIYISEYRET_URL = "https://kocaeliyiseyret.com/";
const STREAM_CONTENT_TEMPLATE =
  "https://content.tvkur.com/l/{streamId}/master.m3u8";

type CameraMetadataItem = {
  headline: string;
  url: string | URL;
  thumbnailUrl: string | URL;
};

export const getCameraMetadata = async () => {
  const response = await fetch(KOCAELIYISEYRET_URL);
  const html = await response.text();
  const $ = loadDOM(html);

  const metadata: CameraMetadataItem[] = $(".single-post")
    .map((i, post) => {
      return {
        headline: $(post).find("h4.post-headline").text().trim(),
        url: new URL(
          $(post).find("a").attr("href") as string,
          KOCAELIYISEYRET_URL
        ),
        thumbnailUrl: new URL(
          $(post).find(".post-thumb img").attr("src") as string,
          KOCAELIYISEYRET_URL
        ),
      };
    })
    .get();

  return metadata;
};

export const getCameraPlayerEmbedUrl = async (
  cameraMetadataItem: CameraMetadataItem
) => {
  const response = await fetch(cameraMetadataItem.url);
  const html = await response.text();
  const $ = loadDOM(html);

  return $("iframe").attr("src") as string;
};

export const getM3u8Url = (playerEmbedUrl: string) => {
  const url = new URL(playerEmbedUrl);
  const streamId = url.pathname.split("/l/")[1];

  return STREAM_CONTENT_TEMPLATE.replace("{streamId}", streamId);
};

export const getKocaeliyiSeyretData = async () => {
  const cameraMetadata = await getCameraMetadata();

  return Promise.all(
    cameraMetadata.map(async (cameraMetadataItem) => {
      const playerEmbedUrl = await getCameraPlayerEmbedUrl(cameraMetadataItem);
      const m3u8Url = getM3u8Url(playerEmbedUrl);
      return {
        ...cameraMetadataItem,
        playerEmbedUrl,
        m3u8Url,
      };
    })
  );
};
