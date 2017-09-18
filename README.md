# gitter-export-room

> Export a JSON archive of a Gitter room's messages

## Install

```shell
$ npm install --global gitter-export-room
```

## Usage

Use `--token` or specify `GITTER_TOKEN` env variable to authenticate.

### List user's rooms

```
$ gitter-export-room list
```

The above command shows the user's rooms and its ids

### Export room

```
$ gitter-export-room id <room_id>
```

The above command will dump a bunch of JSON to STDOUT with progress to STDERR.  Redirect to file if you wish.

See `--help` for help.

## License

Copyright 2016 Christopher Hiller.  Licensed MIT


