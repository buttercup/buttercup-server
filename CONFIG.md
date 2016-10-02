# Server configuration
The following options can be configured in the provided `config.json` file created by the server upon first execution. The initial file has its contents copied from the `resources/config.base.json` file included in the project.

The configuration file is in JSON format, and could look like so:

```json
{
    "archives": {
        "storage": "files",
        "path": "/tmp"
    },
    "logs": [
        {
            "output": "stdout"
        },
        {
            "output": "file",
            "logpath": "/tmp/bcup-server.log"
        }
    ],
    "port": 8080,
    "secret": "secret-shh!"
}
```

## Options

### archives.storage
How to store archive data.

| Key     | Value    |
|---------|----------|
| Type    | `String` |
| Default | "files"  |

| Value   | Description                                |
|---------|--------------------------------------------|
| "files" | Archives & info are stored in files.       |

### archives.path
When `archives.storage` is set to "files", `archives.path` lists the directory in which to store the files.

| Key     | Value    |
|---------|----------|
| Type    | `String` |
| Default | "/tmp"   |

### logs
An array of logging configurations.

#### (config).output
The log type.

| Key     | Value    |
|---------|----------|
| Type    | `String` |
| Default | _None_   |

| Value     | Description                                |
|-----------|--------------------------------------------|
| "stdout"  | Write logs to standard-out                 |
| "stderr"  | Write logs to standard-error               |
| "file"    | Write logs to a rotating-file              |

##### Rotating-file logs ("file")
This mode writes logs to a rotating file, rotated on a daily basis.

Files written in this mode are kept for 7 days.

#### (config).logpath
Filename (full path) for the log file. Available when using the "file" output mode.

| Key     | Value    |
|---------|----------|
| Type    | `String` |
| Default | _None_   |

### port
Port number for the server to listen on.

| Key     | Value    |
|---------|----------|
| Type    | `Number` |
| Default | 8080     |

### secret
Secret phrase used for encryption and hashing.

| Key     | Value         |
|---------|---------------|
| Type    | `String`      |
| Default | "secret-shh!" |
