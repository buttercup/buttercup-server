# Buttercup server
Archive management server for Buttercup.

[![Buttercup](https://buttercup.pw/buttercup.svg)](https://buttercup.pw) [![npm version](https://badge.fury.io/js/buttercup-server.svg)](https://www.npmjs.com/package/buttercup-server)

## About
Commercial password management applications are usually backed by hosted solutions. **Buttercup server** is a package designed at delivering that side of the equation, and will eventually be used to back our own hosted solution.

Keeping with the feel of the rest of the platform, this server will remain open-source and in full-support by the core libraries, meaning you won't be locked into having to pay for a hosted Buttercup archive.

Love hosting your own kit? So do we!

## Usage
To start the server, simply run `npm start`.

Once started the server will create a `config.json` file in the server's directory. This configuration should be modified for the desired use-case of the server. Instructions on the available configuration options can be [found here](CONFIG.md).

There is also a small amount of [API documentation](API.md) as well as a [changelog](CHANGELOG.md).
