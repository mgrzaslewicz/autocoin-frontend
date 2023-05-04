set -e
CONFIG=${CONFIG:-default}
CONFIG_FILE="/config/config.${CONFIG}.json"

DO_NOT_FAIL_SILENTLY_ALTHOUGH_DOCS_DOES_NOT_MENTION_IT="v"

ln -s${DO_NOT_FAIL_SILENTLY_ALTHOUGH_DOCS_DOES_NOT_MENTION_IT} "${CONFIG_FILE}" /usr/share/nginx/html/assets/config.json
nginx -g "daemon off;"
