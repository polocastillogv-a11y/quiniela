export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const espnRes = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',
      { headers: { Referer: 'https://www.espn.com/' } }
    )

    if (!espnRes.ok) throw new Error(`ESPN returned ${espnRes.status}`)

    const data = await espnRes.json()

    const matches = (data.events || []).map(event => {
      const comp = event.competitions?.[0]
      if (!comp) return null

      const statusType = comp.status?.type?.name || ''
      const home = comp.competitors?.find(c => c.homeAway === 'home')
      const away = comp.competitors?.find(c => c.homeAway === 'away')

      let mappedStatus = 'NS'
      let minute = null
      if (statusType === 'STATUS_FINAL' || statusType === 'STATUS_FINAL_PEN') {
        mappedStatus = 'FT'
      } else if (statusType === 'STATUS_IN_PROGRESS' || statusType === 'STATUS_HALFTIME') {
        mappedStatus = 'LIVE'
        const clock = comp.status?.displayClock
        if (clock) {
          const parts = clock.split(':')
          minute = parseInt(parts[0], 10) || 0
        }
      }

      return {
        id: event.id,
        homeAbbrev: home?.team?.abbreviation || null,
        awayAbbrev: away?.team?.abbreviation || null,
        homeScore: home?.score != null ? parseInt(home.score, 10) : null,
        awayScore: away?.score != null ? parseInt(away.score, 10) : null,
        status: mappedStatus,
        minute,
      }
    }).filter(Boolean)

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    res.status(200).json({ matches, source: 'espn' })
  } catch (err) {
    console.error('Live scores proxy error:', err)
    res.status(200).json({ matches: [], source: 'error', error: err.message })
  }
}
