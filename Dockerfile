FROM nginxinc/nginx-unprivileged:1.25

COPY dist /usr/share/nginx/html
COPY server.nginx /etc/nginx/conf.d/app.conf.template
COPY start-server.sh /start-server.sh

CMD sh /start-server.sh

