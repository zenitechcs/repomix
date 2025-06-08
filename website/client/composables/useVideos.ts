import { VIDEO_IDS } from '../constants/videos';

export const useVideos = () => {
  return {
    VIDEO_IDS,
    getVideoId: (key: keyof typeof VIDEO_IDS) => VIDEO_IDS[key],
  };
};
