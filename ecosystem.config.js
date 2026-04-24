/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'haven',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/home/ubuntu/haven',
      env: { NODE_ENV: 'production' },
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'pocketbase',
      script: '/usr/local/bin/pocketbase',
      args: 'serve --http 0.0.0.0:8090 --dir /home/ubuntu/pocketbase/data',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
}
