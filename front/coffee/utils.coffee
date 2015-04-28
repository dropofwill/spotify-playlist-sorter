module.exports = {
  ###
  # Obtains parameters from the hash of the URL
  # @return Object
  ###
  getHashParams: ->
    hashParams = {}
    e = r = /([^&;=]+)=?([^&;]*)/g
    q = window.location.hash.substring(1)

    while e = r.exec(q)
       hashParams[e[1]] = decodeURIComponent(e[2])

    return hashParams

  ###
  # Obtains parameters from the hash of the URL
  # @return Array of Objects
  ###
  getHashPairs: ->
    location.hash.substr(1).split('&').map((pair) ->
      kv = pair.split('=', 2)
      if kv.length is 2
        return [decodeURIComponent(kv[0]), decodeURIComponent(kv[1])]
      else
        return [decodeURIComponent(kv[0]), null])
}
