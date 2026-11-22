import base from '../vite.config.js';

export default {
  ...base,
  server: { ...base.server, port: 5199, strictPort: true, open: false },
};
