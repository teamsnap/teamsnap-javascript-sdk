teamsnap-javascript-sdk
=======================

Javascript SDK for TeamSnap's APIv3

Usage
-----

For use on the web:

Download `teamsnap.js` or `teamsnap.min.js` from the `dist/` folder and include
it on your page. Note: it will not work on IE8 or IE9 because of cross domain
incompatabilities. A proxy will need to be set up on your own domain (nginx
example below).

For use with node.js:

```
npm install --save teamsnap
```


Nginx Proxy Example
-------------------

If your application uses nginx and you'd like to use the teamsnap.js SDK in your
client application, you'll need to install the sub_filter plugin and add the
following to your nginx configuration:

```
location /teamsnap-api/ {
  proxy_pass https://apiv3.teamsnap.com/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  sub_filter https://www.mydomain.com/teamsnap-api/ 'http://go.teamsnap.com/api/';
  sub_filter_once off;
  sub_filter_types application/vnd.collection+json application/json;
}
```
