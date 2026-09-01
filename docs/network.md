# Network and Reverse Proxy Architecture

## Purpose

VenueOS uses VPS Nginx as the public reverse proxy. TLS is terminated on the VPS, while the Docker application communicates internally over HTTP.

The same Docker images can be used in development and production.

---

## Production Architecture

Both production domains point to the same VPS:

| Domain                   | Purpose         |
| ------------------------ | --------------- |
| `venue-os.wotaro.co.uk`  | React frontend  |
| `venue-api.wotaro.co.uk` | Spring Boot API |


### Request Flow

```text
                         Internet
                            │
                 ┌──────────┴──────────┐
                 │                     │
             HTTP :80             HTTPS :443
                 │                     │
                 ▼                     ▼
          HTTPS Redirect          VPS Nginx
                                       │
                                127.0.0.1:8080
                                       │
                                 Docker Nginx
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
              venue-os.wotaro.co.uk      venue-api.wotaro.co.uk
                         │                           │
                     React app                  Spring Boot
                                                     │
                                                     ▼
                                                 PostgreSQL
```

VPS Nginx uses the requested hostname to route traffic to the appropriate application.

### Frontend

```text
venue-os.wotaro.co.uk
        ↓
VPS Nginx
        ↓
Docker Nginx
        ↓
React
```

### API

```text
venue-api.wotaro.co.uk
        ↓
VPS Nginx
        ↓
Docker Nginx
        ↓
Spring Boot
```

---

## Development

Production TLS is not required locally.

```text
localhost:80
     ↓
Docker Nginx
     ↓
React / Spring Boot
```

Docker Nginx routes `/` to React and `/api/` to Spring Boot.

---

## Responsibilities

| Component    | Responsibility                           |
| ------------ | ---------------------------------------- |
| DNS          | Points domains to the VPS                |
| VPS Firewall | Controls public network access           |
| VPS Nginx    | Public reverse proxy and TLS termination |
| Certbot      | Manages Let's Encrypt certificates       |
| Docker Nginx | React hosting and application routing    |
| Spring Boot  | Backend/API                              |
| PostgreSQL   | Database                                 |

---

## Security

Only the following ports should be publicly accessible:

* `80` — HTTP / certificate validation
* `443` — HTTPS
* Required SSH port

Docker Nginx is published to `127.0.0.1:8080` on the VPS, preventing direct Internet access.

Spring Boot and PostgreSQL are only accessible through the Docker network.

TLS certificates and private keys remain on the VPS and are not stored in Git, `.env`, or Docker images.
