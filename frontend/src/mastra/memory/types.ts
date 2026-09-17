export type MemoryIds = {
  thread: string;
  resource: string;
};

export type MemoryIdsResolution =
  | { ok: true; ids: MemoryIds }
  | { ok: false; error: string };
