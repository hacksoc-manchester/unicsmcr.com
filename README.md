# HackSoc Web Application

The official website of [HackSoc](https://hacksoc.com/) from The University of Manchester. We also have a [Facebook](https://www.facebook.com/groups/HackSocManc/), a [Twitter](https://twitter.com/hacksocmcr) and an [Instagram](https://www.instagram.com/hacksoc.mcr/) page!

## Getting Started
### Prerequisites
#### Required:
* Node.js (>v8.x.x)
* MySQL database

#### Optional:
* reCAPTCHA secret key and site key, get them [here](https://www.google.com/recaptcha/admin)
* SendGrid API key, get it [here](https://app.sendgrid.com/settings/api_keys) (you can sign up with the [GitHub Student Developer Pack](https://education.github.com/pack) to get 15k free email per month)
* Flickr API key and secret, create an app and get the keys [here](https://www.flickr.com/services/)
* Facebook Graph API token, create an app and get the token [here](https://developers.facebook.com/apps/) 

### Starting the app
 * `git pull https://github.com/hacksoc-manchester/hacksoc.com.git`
 * `cd hacksoc.com`
 * Set up the environment variables (below)
 * `npm i`
 * `npm start`, or `npm run start:watch` for automatic restarts after code changes

### Environment Variables

Create a file called `.env` in the project root directory and make sure it's added in `.gitignore` (if using Windows, you might have to name it `.env.`).

Paste the following text in the file and edit the variable values sensibly:

```bash

PORT="default port is 5000"

ENVIRONMENT="dev"|"production"

SESSIONS_SECRET="some random string"

DB_DIALECT="mysql"
DB_DATABASE="the database name to be used for the app"
DB_HOST="the host of the database"
DB_PORT="the port of the database"
DB_USER="the username for the user of the database"
DB_PASSWORD="the password for the user of the database"

#optional
FLICKR_API_KEY="your Flickr app API key"

#optional
FLICKR_API_SECRET="your Flickr app API secret"

#optional
FLICKR_USER_ID="the Flickr user to download the gallery from"

#optional
FB_API_TOKEN="your Facebook app API token"

#optional
FB_API_TOKEN_EXPIRATION_DATE="the expiration date of the FB token in the following format: dd/mm/yy (e.g.: 30/11/18)"

#optional
G_RECAPTCHA_KEY="your reCAPTCHA site key"

#optional
G_RECAPTCHA_SECRET="your reCAPTCHA secret key"

#optional
SENDGRID_API_KEY="your SendGrid API key"
```

### Running Tests

* Go to the root directory of the app
* Run `npm test`
  

### Authors

See the [CONTRIBUTORS](CONTRIBUTORS) file.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.