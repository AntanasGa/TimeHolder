import { CacheTypes } from "@/stores/documents";

export async function createFile(data: Blob, fileName?: string) {
  return new Promise((resolve, reject) => {
    if (!window) {
      return reject(new Error('window does not exist'));
    }
    fileName ??= `${new Date().valueOf()}.${getExtension(data)}`;
    const downloadEl = document.createElement('a');
    downloadEl.download = fileName;
    downloadEl.href = URL.createObjectURL(data);
    downloadEl.click();
    requestAnimationFrame(() => (downloadEl.remove(), resolve(void 0)));
  });
}

export async function createCacheBlob(data: CacheTypes): Promise<Blob> {
  return new Promise((resolve) => {
    resolve(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  });
}

function getExtension(data: Blob | File) {
  let mime = data.type;
  switch (mime) {
    case 'application/json':
      return 'json';
    case 'text/plain':
      return 'txt';
    default:
      return 'unknown';
  }
}
