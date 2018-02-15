# ssb-server-channel

## Usage

```js
const Server = require('scuttlebot')
const config = { ... } // needs options

// Install the plugin
Server
  .use(require('scuttlebot/plugins/master')) // required
  .use(require('ssb-server-channel'))
  .use(require('ssb-backlinks')) // not required, just an example

// Start the server
const server = Server(config)
```

## API

### server.channel.subscriptions(cb)

Get the channels and who is subscribed where `cb(err, data)` is called with `data` of form:

```js
{
  [ChannelName]: [
    [FeedId, Timestamp],
    [FeedId, Timestamp],
  ]
}
```

e.g

```js
{
  learning: [
    ['@gaQw6z...', 1518663315275],
    ['@ye+QM09...', 1518663311233]
  ],
  brazil: [
    ['@gaQw6z...', 1518663129468],
  ]
}
```


### server.channel.get(cb)

Get the current state of the channel view. This will wait until the view is up to date, if necessary.

`cb(err, data)` is a standard callback function where `data` is of the form:

(same as `channel.subscriptions` at the moment)

### server.channel.stream() => pull-stream source

Be careful, this is a stream which provides:
- an initial value
- 'change' values (for all values after the initial value)
- `{ sync: true }` values when the view is up to date with the db (if you use the `{live: true}` option)

For details see : [https://github.com/flumedb/flumeview-reduce](https://github.com/flumedb/flumeview-reduce#dbnamestreamlive-boolean--pullsource)



