import ufs from 'url-file-size';

export const FilesizeService = {
  async getFileSize(url: string): Promise<number> {
    return ufs(url).catch(reason => {
      console.error(reason);

      return 0;
    });
  }
};
