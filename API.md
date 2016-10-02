# Request API
Requests listed here describe a basic form of the Buttercup server API.

## Account requests
Account-based requests can be made to the `/account` path. These requests should usually **not be made public**.

| Method | Example                                             | Description                                                      |
|--------|-----------------------------------------------------|------------------------------------------------------------------|
| POST   | `{ "request": "create", "email": "", "passw": "" }` | Create a new account with `email` and `passw`.                   |

## Archive requests
Archive requests (getting, saving) can be made to the `/archive` path.

| Method | Example                                                          | Description                                                      |
|--------|------------------------------------------------------------------|------------------------------------------------------------------|
| POST   | `{ "request": "get", "email": "", "passw": "" }`                 | Get an existing archive. Returns an **archive response**.        |
| POST   | `{ "request": "save", "email": "", "passw": "", "archive": "" }` | Save an archive to the server.                                   |

### Archive response
A successful response when retrieving an archive may look like the following:

```json
{
    "status": "ok",
    "archive": "..."
}
```

`archive` may be empty (new) or will contain the encrypted archive.
