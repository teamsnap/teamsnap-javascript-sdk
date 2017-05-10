module.exports = (data) ->
  # bigint is a problem for JS. Currently we have a field on some objects called
  # `persistentUuid` that can potentially return an integer that won't be
  # properly parsed. Right now, this only handles that specific field, but
  # in the future we may stringify all large numbers this way.
  regex = /\"name\"\:\"persistent_uuid\"\,\"value\"\:(\d+)/g
  return data.replace(regex, '"name":"persistent_uuid","value":"\$1"')
