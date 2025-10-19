module.exports = {
  apps: [
    {
      name: 'eclat-api',
      script: 'dist/index.js',
      cwd: './server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
