set -e
CONFIG=${CONFIG:-default}
CONFIG_FILE_SOURCE="/config/config.${CONFIG}.json"
CONFIG_FILE_TARGET="/usr/share/nginx/html/assets/config.json"

if [ ! -f "${CONFIG_FILE_TARGET}" ]; then
  echo "Symbolic link for config does not exist yet, creating one..."
  DO_NOT_FAIL_SILENTLY_ALTHOUGH_DOCS_DOES_NOT_MENTION_IT="v"
  ln -s${DO_NOT_FAIL_SILENTLY_ALTHOUGH_DOCS_DOES_NOT_MENTION_IT} "${CONFIG_FILE_SOURCE}" "${CONFIG_FILE_TARGET}"
fi

nginx -g "daemon off;"
