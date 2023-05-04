CONFIG=${CONFIG:-default}
CONFIG_FILE="/config/config.${CONFIG}.json"
ln -s "${CONFIG_FILE}" /usr/share/nginx/html/assets/config.json
nginx -g "daemon off;"
