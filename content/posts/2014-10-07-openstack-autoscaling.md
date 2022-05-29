---
layout: post
title: Openstack - How To Attach To An Autoscaling Group Or An Arbitrary Group Of Nodes
summary: "In order to use a load balancer with an autoscaling group- we should use a nested stack to achieve. We can define the AutoScaling Group and LoadBalancer pool in the top level template."
categories: articles
tags: [openstack, autoscaling]
comments: true
share: true
modified: 2014-07-19T15:12:53+05:30
author: sab
---

In order to use a load balancer with an autoscaling group- we should use a
nested stack to achieve. We can define the AutoScaling Group and LoadBalancer
pool in the top level template and define the autoscaling instance and members
in the nested templates. Then the loadbalancer pool id can be passed into the
nested template as a property and be used by OS::Neutron::PoolMember to
associate each nova server when they are created. The example template can be
found
at:
[scale.yaml](https://github.com/shabinesh/OpenStack-heat-test-templates/blob/master/scale.yaml) and
[server.yaml](https://github.com/shabinesh/OpenStack-heat-test-templates/blob/master/server.yaml)

# URL mapping: how to select which URL paths get mapped and in what fashion

The following are specific to HAProxy:

The URL specific forwards to backend server can be done using ACLs. There are
directives to match an url: path_beg , path_end etc.

```
Frontend main *:80
           Acl  url_app1  path_beg  /app1
           Acl  url_app2  path_beg  /app2
           Use_backend   app1_backend  if  url_app1
           Use_backend   app2_backend  if  url_app2
      Backend  app1_backend
           Balance    roundrobin
           Server     app1    127.0.0.1:5001    check
           Server     app2    127.0.0.1:5002    check
      Backend  app2_backend
           Balance    roundrobin
           Server     app1    127.0.0.1:5003    check
           Server     app2    127.0.0.1:5004    check
```

Specific to Nginx:

```
server {
    listen 80;
    # ... other stuff

    upstream backend1 {
        server 127.0.0.1:8080;
    }

    location /test/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://192.168.1.2;
    }
    location /news/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://192.168.1.1;
    }

}
```

*Sticky sessions:* application-specific cookie There are two ways a server can be
identified when requests are routed through HAProxy, Cookie Insert method
:Loadbalancer will add a Set-Cookie Header with a server name as its value. So
when the client sends back the response with the cookie HAProxy knows which back
end server it should be sending it to. The configuration for haproxy will have:

Cookie Prefix method::Loadbalancer will prefix the application cookie with a
server name. `cookie JSESSION_ID` prefix

The request response cycle between client and server will be:
1. Set-Cookie: s1~JSESSION_ID=jashfkjsd323r49983214hj0j4h94gds
2. Cookie: s1~JSESSION_ID=jashfkjsd323r49983214hj0j4h94gds
3. Cookie: JSESSION_ID=jashfkjsd323r49983214hj0j4h94gds (from HAProxy to application.)

For Nginx: In case of Nginx, the redirection can be specific to host running an
application instance. In this way the session is maintained. A sample
configuration may look like this:

```
server {
    ...
    set $upstream "default-app-Server";
    if ($http_cookie ~ "Host=([\w-]+)") {
        set $upstream $1;                                   
    }

    location /original-request {
        proxy_pass http://$upstream/$uri
    }
}
```
