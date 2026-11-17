globalThis.MediaBlur = Object.freeze({
  defaults: Object.freeze({ enabled: true, videos: true, images: false, videoStrength: 50, imageStrength: 50, filterBy: 'width', imageThreshold: 200, eyeOpacity: 70, videoEyeSize: 36, videoEyeOpacity: 70, videoPanelOpacity: 90 }),
  qualifies(width, height, settings) {
    if (width <= 0 || height <= 0) return false;
    const size = settings.filterBy === 'area' ? width * height : settings.filterBy === 'height' ? height : width;
    return size > settings.imageThreshold;
  },
  normalize(raw = {}) {
    const result = { ...this.defaults };
    for (const key of ['enabled', 'videos', 'images']) {
      if (typeof raw[key] === 'boolean') result[key] = raw[key];
    }
    for (const key of ['videoStrength', 'imageStrength', 'eyeOpacity', 'videoEyeOpacity', 'videoPanelOpacity']) {
      if (typeof raw[key] === 'number' && Number.isFinite(raw[key])) {
        result[key] = Math.round(Math.max(0, Math.min(100, raw[key])));
      }
    }
    if (['width', 'height', 'area'].includes(raw.filterBy)) result.filterBy = raw.filterBy;
    if (typeof raw.imageThreshold === 'number' && Number.isFinite(raw.imageThreshold)) {
      result.imageThreshold = Math.round(Math.max(0, Math.min(result.filterBy === 'area' ? 4000000 : 4000, raw.imageThreshold)));
    }
    if (typeof raw.videoEyeSize === 'number' && Number.isFinite(raw.videoEyeSize)) result.videoEyeSize = Math.round(Math.max(20, Math.min(80, raw.videoEyeSize)));
    return result;
  }
});
