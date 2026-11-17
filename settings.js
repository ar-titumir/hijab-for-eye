globalThis.MediaBlur = Object.freeze({
  defaults: Object.freeze({ enabled: true, videos: true, images: false, videoStrength: 50, imageStrength: 50 }),
  normalize(raw = {}) {
    const result = { ...this.defaults };
    for (const key of ['enabled', 'videos', 'images']) {
      if (typeof raw[key] === 'boolean') result[key] = raw[key];
    }
    for (const key of ['videoStrength', 'imageStrength']) {
      if (typeof raw[key] === 'number' && Number.isFinite(raw[key])) {
        result[key] = Math.round(Math.max(0, Math.min(100, raw[key])));
      }
    }
    return result;
  }
});
