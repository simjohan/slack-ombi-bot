export interface SearchReponse {
  id?: number;
  title?: string;
  overview?: string;
  poster?: string;
}

export interface RequestEngineResult {
  result: boolean;
  message?: string;
  isError?: boolean;
  errorMessage?: string;
  errorCode: ErrorCode;
  requestId: number;
}

enum ErrorCode {
  AlreadyRequested,
  EpisodesAlreadyRequested,
  NoPermissionsOnBehalf,
  NoPermissions,
  RequestDoesNotExist,
  ChildRequestDoesNotExist,
  NoPermissionsRequestMovie,
  NoPermissionsRequestTV,
  NoPermissionsRequestAlbum,
  MovieRequestQuotaExceeded,
  TvRequestQuotaExceeded,
  AlbumRequestQuotaExceeded,
}
