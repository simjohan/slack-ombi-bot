import { RequestEngineResult, SearchReponse } from "./models";

const apiKey = process.env.OMBI_API_KEY!!;
const ombiApiLocation = process.env.OMBI_API_LOCATION!!;

export default async function searchMedia(
  searchTerm: string
): Promise<SearchReponse[]> {
  const esacpedSearchTerm = encodeURI(searchTerm);
  const res = await fetch(
    `${ombiApiLocation}/search/multi/${esacpedSearchTerm}`,
    {
      method: "POST",
      headers: {
        ApiKey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movies: true,
        // tvShows: true,
      }),
    }
  );

  const json = await res.json();
  console.log(json);
  return json;
}

export async function requestMovie(
  tmdbid: string,
  requestUser: string
): Promise<RequestEngineResult> {
  const res = await fetch(
    `http://192.168.1.182:3579/ombi/api/v1/Request/Movie/`,
    {
      method: "POST",
      headers: {
        ApiKey: apiKey,
        "Content-Type": "application/json",
        ApiAlias: requestUser,
      },
      body: JSON.stringify({
        theMovieDbId: tmdbid,
        languageCode: "en",
        qualityPathOverride: "6", // HD 720p / 1080p
        rootFolderOverride: "1",
        is4KRequest: false,
      }),
    }
  );

  const requestEngineResult = (await res.json()) as RequestEngineResult;
  return await requestEngineResult;
}
