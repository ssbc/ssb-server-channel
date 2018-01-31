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
  [ChannelName]: Set  // set of FeedIds of users subscribed to that channel 
}
```

e.g

```js
{
  'ssb-learning': Set { '@gaQw6z...', '@ye+QM09...' },
  'brazil': Set { '@gaQw6z...' }
}
```

Check your [Set methods **on MDN**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

And if you really need an Array : 

```js
const s = new Set ()
set.add('mixmix')
set.add('soapdog')

[...s]         // => ['mixmix', 'soapdog']
Array.from(s)  // => ['mixmix', 'soapdog']
```


### server.channel.get(cb)

Get the current state of the channel view. This will wait until the view is up to date, if necessary.

`cb(err, data)` is a standard callback function where `data` is of the form:

```js
{
  [ChannelName]: Set  // set of FeedIds of users subscribed to that channel 
}
```

### server.channel.stream() => pull-stream source

Be careful, this is a stream which provides:
- an initial value
- 'change' values (for all values after the initial value)
- `{ sync: true }` values when the view is up to date with the db (if you use the `{live: true}` option)

For details see : [https://github.com/flumedb/flumeview-reduce](https://github.com/flumedb/flumeview-reduce#dbnamestreamlive-boolean--pullsource)



