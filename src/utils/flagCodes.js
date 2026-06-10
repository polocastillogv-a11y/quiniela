const codes = {
  MEX: 'MX', RSA: 'ZA', KOR: 'KR', CZE: 'CZ',
  CAN: 'CA', BIH: 'BA', QAT: 'QA', SUI: 'CH',
  BRA: 'BR', MAR: 'MA', HAI: 'HT', SCO: 'gb-sct',
  USA: 'US', PAR: 'PY', AUS: 'AU', TUR: 'TR',
  GER: 'DE', CUW: 'CW', CIV: 'CI', ECU: 'EC',
  NED: 'NL', JPN: 'JP', SWE: 'SE', TUN: 'TN',
  BEL: 'BE', EGY: 'EG', IRN: 'IR', NZL: 'NZ',
  ESP: 'ES', CPV: 'CV', KSA: 'SA', URU: 'UY',
  FRA: 'FR', SEN: 'SN', IRQ: 'IQ', NOR: 'NO',
  ARG: 'AR', ALG: 'DZ', AUT: 'AT', JOR: 'JO',
  POR: 'PT', COD: 'CD', UZB: 'UZ', COL: 'CO',
  ENG: 'gb-eng', CRO: 'HR', GHA: 'GH', PAN: 'PA',
}

export function getAlpha2(code3) {
  return codes[code3]?.toLowerCase() || 'un'
}
