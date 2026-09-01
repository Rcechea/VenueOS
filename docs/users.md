# Users and Permissions

## Purpose

This document defines the users configured on the production VPS, their access methods, and their permissions.

## User Model

| User         | Purpose                         | SSH Access | Sudo |      Docker | Application Access                |
| ------------ | ------------------------------- | ---------: | ---: | ----------: | --------------------------------- |
| `root`       | System administrator            | ❌ Disabled |  N/A |         N/A | Full system access                |
| `deployment` | Application deployment          |          ✅ |    ❌ | See details | Venue folder, Git & Docker script |
| `razvan`     | Server administration           |          ✅ |    ✅ |           ✅ | Full system access                |
| `geo`        | Developer / maintenance account |          ✅ |    ❌ |           ❌ | `.env` file + application logs    |

## Root Access

Direct SSH login for root is disabled.

All administrative access is performed through an authorised user account using SSH keys and, where required, `sudo`.

## Deployment User

The deployment user is used for application deployments.

Permissions:

* SSH access using an SSH key [Stored in Git Vault]
* Can execute `/usr/local/bin/deploy-venue` with `sudo`. No other sudo permissions are granted.
* [Deployment Script Documentation](./deployment-script.md)
* No Docker access from CLI. Can only compose by the script.
* Full read/write access to the application source and deployment files within the application directory, but no access to production secrets.
* The `.env` and `docker-compose.yml` are saved into `/etc/venuewebapp/` by the script. No access to edit those.
* This was done to ensure that the deployment account cannot run Docker and gain access to the system through the configuration file.
* The account should have only the permissions required to perform deployments.

## Razvan Account

The `razvan` account is used for server administration and development-related maintenance.

Permissions:

* SSH access using an SSH key
* Has `sudo` permissions

## Geo Account

The `geo` account is used for developing maintenance.

Permissions:

* SSH access using an SSH key
* No sudo access
* No permission to modify application logs
* Can view logs
* Can edit `.env` for application configuration and secret management

## SSH Access

SSH access is restricted to authorised user accounts.

Authentication method:

* SSH keys
* Password authentication disabled
* Root SSH login disabled

Authorised accounts:

* `deployment`
* `razvan`
* `geo`

## File and Log Permissions

Application files and logs are owned by [user/group].

The required access model is:

| Resource             | Deployment | Razvan |    Geo |
| -------------------- | ---------: | -----: | -----: |
| Application files    |       [RW] | [None]* | [None] |
| `docker-compose.yml` |        [R] |    [None]* |    [R] |
| `.env` / secrets     |     [None] | [None]* |   [RW] |
| Application logs     |        [R] |   [None]* |    [R] |

[*] Can sudo edit them 

## Verification

The following should be checked after server setup:

```bash
sudo -l -U deployment

sudo -l -U razvan

sudo -l -U geo

id deployment

id razvan

id geo

ls -la /etc/venuewebapp
```

The permissions documented above must match the actual server configuration.
