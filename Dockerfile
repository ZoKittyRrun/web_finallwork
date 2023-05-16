FROM nginx:1.23.3

COPY dist  /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx","-g","daemon off;"]
