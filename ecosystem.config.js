module.exports = {
  apps: [
    {
      name: 'buque-whatsapp-swarm',
      script: 'src/buque-whatsapp-bot.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '650M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'data/logs/pm2-error.log',
      out_file: 'data/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000
    }
  ]
};
