module.exports = {
  apps: [
    {
      name: 'integrar-mais-laudos',
      script: 'server.js', // Replace with the actual path to your application's main script
      log_date_format: 'DD/MM/YYYY HH:mm:ss.SSS',
      out_file: './logs/NodeOut.log', // Specify the log file for standard output
      error_file: './logs/NodeError.log', // Specify the log file for standard error
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ]
};
