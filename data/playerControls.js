const player = {}

const youtube = {
  center: { addVideo: 1, skipVideo: 1, removePlayer: 1 },
  downBar: { pause: 1, play: 1, volume: 1, time: 1, skim: 1, fullscreen: 1 }
}

const twitch = {
  center: { removePlayer: 1 },
  downBar: false
}

const dailymotion = {
  center: { addVideo: 1, skipVideo: 1, removePlayer: 1 },
  downBar: { pause: 1, play: 1, volume: 1, time: 1, skim: 1, fullscreen: 1 }
}

export default { player, youtube, twitch, dailymotion }
