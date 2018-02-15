const FlumeView = require('flumeview-reduce')
const get = require('lodash/get')
const set = require('lodash/set')

const FLUME_VIEW_VERSION = 1.1

module.exports = {
  name: 'channel',
  version: require('./package.json').version,
  manifest: {
    get: 'async',
    stream: 'source',
    subscriptions: 'async',
    reduce: 'sync'
  },
  init: (server, config) => {
    // console.log('///// CHANNELS plugin loaded /////')

    const view = server._flumeUse(
      'channel',
      FlumeView(FLUME_VIEW_VERSION, reduce, map, null, initialState())
    )

    return {
      get: view.get,
      subscriptions: view.get,
      stream: view.stream,
      reduce
    }
  }
}

function initialState() {
  return {}
}

function map(msg) {
  if (get(msg, 'value.content.type') !== 'channel') return null

  const author = msg.value.author
  const timestamp = msg.value.timestamp
  const channel = get(msg, 'value.content.channel', '').replace(/^#/, '')
  const subscribed = get(msg, 'value.content.subscribed')

  if (typeof channel === undefined || typeof subscribed === undefined) {
    console.log('Malformed channel subscription', msg)
    return null
  }

  return {
    author,
    timestamp,
    channel,
    subscribed
  }
}

function reduce (soFar, newSub) {
  process.stdout.write('c')
  const { author, timestamp, channel, subscribed } = newSub

  var channelSubs = get(soFar, [channel], [])
  var current = channelSubs.find(entry => entry[0] === author)

  // if current recorded statement was more recent than this 'newSub', ignore newSub
  if (current && current[1] > timestamp) return soFar

  // remove all subs entries for this author
  channelSubs = channelSubs.filter(entry => entry[0] !== author)

  if (subscribed) channelSubs.push([author, Number(new Date())])

  soFar[channel] = channelSubs

  return soFar
}

// state: 
// {
//   [Channel]: [ Set
//     FeedId
//   ]
// }


// {
//   'ssb-learning': [
//     '@ye14....',
//     '@weandre..',
//   ],
//   'brazil': [
//     '@weandre..',
//   ]
// }

// channel message: 
// value: {
//   author: FeedId,
//   content: {
//     {
//       type: 'channel',
//       channel: String,    // ssb-learning
//       subscribed: Boolean
//     }
//   }
// }

