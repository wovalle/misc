# nginx-proxy
docker run --detach \
--name proxy \
-p 80:80 \
-p 443:443 \
-v /etc/nginx/certs \
-v /etc/nginx/vhost.d \
-v /usr/share/nginx/html \
-v /var/run/docker.sock:/tmp/docker.sock:ro \
--restart always \
jwilder/nginx-proxy:alpine

# nginx-proxy-ssl
docker run --detach \
--name proxy-letsencrypt \
--volumes-from nginx-proxy \
--volume /var/run/docker.sock:/var/run/docker.sock:ro \
--restart always \
jrcs/letsencrypt-nginx-proxy-companion

# Portainer 
docker volume create portainer_data
docker run \
-d \
--name portainer \
-p 9000:9000 \
-e "VIRTUAL_HOST=portainer.willyovalle.me" \
-e "LETSENCRYPT_HOST=portainer.willyovalle.me" \
-e "LETSENCRYPT_EMAIL=willyovalle16@gmail.com" \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data
--restart unless-stopped \
portainer/portainer

#VPN
  docker run \
  --detach \
  --name=vpn \
  --cap-add=NET_ADMIN \
  -p 943:943 \
  -p 9443:9443 \
  -p 1194:1194/udp \
  -e PUID=1000 \
  -e PGID=999 \
  -e INTERFACE=eth0 `#optional` \
  -e TZ=Europe/Stockholm \
  -e "VIRTUAL_HOST=vpn.willyovalle.me" \
  -e "LETSENCRYPT_HOST=vpn.willyovalle.me" \
  -e "LETSENCRYPT_EMAIL=willyovalle16@gmail.com" \
  -e "VIRTUAL_PORT=943" \
  -e "VIRTUAL_PROTO=https" \
  -v "$HOME/data/openvpn:/config" \
  --restart unless-stopped \
  linuxserver/openvpn-as

#Pihole
docker run -d \
--name pihole \
-p 53:53/tcp \
-p 53:53/udp \
-p 10080:80 \
-p 10443:443 \
-e TZ="Europe/Stockholm" \
-e "VIRTUAL_HOST=pihole.willyovalle.me" \
-e "LETSENCRYPT_HOST=pihole.willyovalle.me" \
-e "LETSENCRYPT_EMAIL=willyovalle16@gmail.com" \
-v "$(pwd)/pihole/:/etc/pihole/" \
-v "$(pwd)/dnsmasq/:/etc/dnsmasq.d/" \
--dns=127.0.0.1 \
--dns=1.1.1.1 \
--restart=unless-stopped \
pihole/pihole:latest  