/* js/data.js — mock data store and model metadata */

const DB = {
  all: {
    today: { req: 12480,   tokens: 94200,    inp: 36800,   out: 57400,   prevReq: 11200,  prevTok: 84000    },
    '7d':  { req: 284390,  tokens: 1284390,  inp: 500212,  out: 700212,  prevReq: 252000, prevTok: 1140000  },
    '30d': { req: 1102000, tokens: 5430000,  inp: 2100000, out: 3000000, prevReq: 990000, prevTok: 4880000  },
    '3m':  { req: 3200000, tokens: 15400000, inp: 6000000, out: 8800000, prevReq: 2900000,prevTok: 14000000 },
  },
  'claude-haiku': {
    today: { req: 5200,   tokens: 42000,   inp: 16000,  out: 26000,  prevReq: 4800,   prevTok: 38000   },
    '7d':  { req: 120000, tokens: 540000,  inp: 210000, out: 300000, prevReq: 110000, prevTok: 490000  },
    '30d': { req: 480000, tokens: 2100000, inp: 800000, out: 1200000,prevReq: 430000, prevTok: 1900000 },
    '3m':  { req: 1400000,tokens: 6200000, inp: 2400000,out: 3600000,prevReq: 1250000,prevTok: 5600000 },
  },
  'chatgpt-5': {
    today: { req: 3800,  tokens: 28000,  inp: 10000, out: 18000, prevReq: 3500,  prevTok: 25000  },
    '7d':  { req: 84390, tokens: 380000, inp: 148000,out: 212000,prevReq: 79000, prevTok: 345000 },
    '30d': { req: 320000,tokens: 1500000,inp: 600000,out: 880000,prevReq: 288000,prevTok: 1350000},
    '3m':  { req: 940000,tokens: 4400000,inp: 1700000,out:2600000,prevReq:850000,prevTok:4000000 },
  },
  'gemini-pro': {
    today: { req: 2200,  tokens: 15400, inp: 6400,  out: 9000,  prevReq: 2100,  prevTok: 14000  },
    '7d':  { req: 52000, tokens: 220000,inp: 86000, out: 124000,prevReq: 48000, prevTok: 200000 },
    '30d': { req: 200000,tokens: 860000,inp: 340000,out: 500000,prevReq: 178000,prevTok: 780000 },
    '3m':  { req: 590000,tokens: 2500000,inp:980000,out:1440000,prevReq:530000, prevTok:2250000 },
  },
  'llama-3': {
    today: { req: 1280,  tokens: 8800,  inp: 3400, out: 5200, prevReq: 800,   prevTok: 7000   },
    '7d':  { req: 28000, tokens: 144000,inp: 56000,out: 64000,prevReq: 22000, prevTok: 120000 },
    '30d': { req: 102000,tokens: 970000,inp: 360000,out:420000,prevReq:94000, prevTok: 880000 },
    '3m':  { req: 300000,tokens: 2800000,inp:1100000,out:1500000,prevReq:270000,prevTok:2550000},
  },
  'gpt-4o': {
    today: { req: 142780, tokens: 891230, inp: 318450, out: 572780, prevReq: 130000, prevTok: 820000 },
    '7d':   { req: 142780, tokens: 891230, inp: 318450, out: 572780, prevReq: 130000, prevTok: 820000 },
    '30d':  { req: 142780, tokens: 891230, inp: 318450, out: 572780, prevReq: 130000, prevTok: 820000 },
    '3m':   { req: 142780, tokens: 891230, inp: 318450, out: 572780, prevReq: 130000, prevTok: 820000 },
  },
};

// Models shown in the "Usage by Model" cards when "All Model" is selected
const USAGE_BY_MODEL_KEYS = ['claude-haiku', 'chatgpt-5', 'gpt-4o'];

const MODEL_META = {
  'claude-haiku': {
    name: 'Claude Haiku 6.0',
    id:   'anthropic/claude-haiku-6.0',
    bg:   '#F5F5F5',
    logo: 'anthropic',
  },
  'chatgpt-5': {
    name: 'Chat GPT  5.5',
    id:   'openai/chat gpt  5.5',
    bg:   '#F5F5F5',
    logo: 'openai',
  },
  'gemini-pro': {
    name: 'Gemini Pro 2.5',
    id:   'google/gemini-pro-2.5',
    bg:   '#4285F4',
    logo: 'text:G',
  },
  'llama-3': {
    name: 'Llama 3 70B',
    id:   'meta/llama-3-70b',
    bg:   '#0668E1',
    logo: 'text:M',
  },
  'gpt-4o': {
    name: 'GPT-4o',
    id:   'azure/gpt-4o',
    bg:   '#F5F5F5',
    logo: 'microsoft',
  },
};

// Provider logo images — sourced from "images/models logo/" (resolved against
// window.ASSET_BASE at render time so the path still works from subfolder pages)
const LOCAL_LOGOS = {
  anthropic: 'images/models logo/type=anthropic.png',
  openai:    'images/models logo/type=open ai.png',
  microsoft: 'images/models logo/type=microsoft.png',
};

const REMOTE_LOGOS = {
  google:  'https://cdn.simpleicons.org/googlegemini',
  meta:    'https://cdn.simpleicons.org/meta',
  mistral: 'https://cdn.simpleicons.org/mistralai',
};

function getLogoHtml(meta) {
  if (LOCAL_LOGOS[meta.logo]) {
    const base = window.ASSET_BASE || '';
    return `<img src="${base}${LOCAL_LOGOS[meta.logo]}" alt="${meta.logo}" style="width:70%;height:70%;object-fit:contain">`;
  }
  if (REMOTE_LOGOS[meta.logo]) {
    return `<img src="${REMOTE_LOGOS[meta.logo]}" alt="${meta.logo}" width="20" height="20" style="width:20px;height:20px;object-fit:contain">`;
  }
  const letter = meta.logo.replace('text:', '');
  return `<span style="font-size:12px;font-weight:700;color:#fff">${letter}</span>`;
}

// ── SUPER ADMIN DATA (stored separately from Product Owner / My Usage data) ──

const ADMIN_STATS = {
  req: 1284390, tokens: 8540000, inp: 3210000, out: 5330000,
  prevReq: 1150000, prevTok: 7700000,
};

const LEADERBOARD_DATA = {
  po: {
    mostActive: [
      { name: 'Olivia Davis',     tokens: 8450 },
      { name: 'Noah Brown',       tokens: 7320 },
      { name: 'Sophia Garcia',    tokens: 6890 },
      { name: 'Ava Wilson',       tokens: 5740 },
      { name: 'Liam Smith',       tokens: 4920 },
      { name: 'Emma Johnson',     tokens: 3810 },
      { name: 'Mia Rodriguez',    tokens: 3200 },
      { name: 'Charlotte Lee',    tokens: 2670 },
      { name: 'Amelia Walker',    tokens: 1540 },
      { name: 'Isabella Martinez',tokens: 980  },
    ],
    leastActive: [
      { name: 'James Anderson',    tokens: 120  },
      { name: 'Lucas Thomas',      tokens: 240  },
      { name: 'Henry Jackson',     tokens: 390  },
      { name: 'Grace White',       tokens: 510  },
      { name: 'Benjamin Harris',   tokens: 640  },
      { name: 'Chloe Martin',      tokens: 780  },
      { name: 'Daniel Thompson',   tokens: 920  },
      { name: 'Ella Garcia',       tokens: 1050 },
      { name: 'Jackson Lee',       tokens: 1180 },
      { name: 'Scarlett Robinson', tokens: 1310 },
    ],
    topModels: [
      { name: 'Claude Haiku 6.0', tokens: 1320, logo: 'anthropic', bg: '#F5F5F5' },
      { name: 'Chat GPT 5.5',     tokens: 1320, logo: 'openai',    bg: '#F5F5F5' },
      { name: 'GPT-4o',           tokens: 980,  logo: 'microsoft', bg: '#F5F5F5' },
    ],
  },
  admin: {
    mostActive: [
      { name: 'Olivia Davis',     tokens: 48200 },
      { name: 'Noah Brown',       tokens: 43750 },
      { name: 'Sophia Garcia',    tokens: 39100 },
      { name: 'Ava Wilson',       tokens: 35820 },
      { name: 'Liam Smith',       tokens: 31440 },
      { name: 'Emma Johnson',     tokens: 27390 },
      { name: 'Mia Rodriguez',    tokens: 23810 },
      { name: 'Charlotte Lee',    tokens: 19650 },
      { name: 'Amelia Walker',    tokens: 15200 },
      { name: 'Isabella Martinez',tokens: 11870 },
    ],
    leastActive: [
      { name: 'James Anderson',    tokens: 320  },
      { name: 'Lucas Thomas',      tokens: 580  },
      { name: 'Henry Jackson',     tokens: 790  },
      { name: 'Grace White',       tokens: 1040 },
      { name: 'Benjamin Harris',   tokens: 1350 },
      { name: 'Chloe Martin',      tokens: 1720 },
      { name: 'Daniel Thompson',   tokens: 2190 },
      { name: 'Ella Garcia',       tokens: 2640 },
      { name: 'Jackson Lee',       tokens: 3010 },
      { name: 'Scarlett Robinson', tokens: 3480 },
    ],
    topModels: [
      { name: 'Claude Haiku 6.0',  tokens: 48200, logo: 'anthropic', bg: '#F5F5F5' },
      { name: 'Chat GPT 5.5',      tokens: 43750, logo: 'openai',    bg: '#F5F5F5' },
      { name: 'GPT-4o',            tokens: 39100, logo: 'microsoft', bg: '#F5F5F5' },
      { name: 'Claude Opus 4',     tokens: 35820, logo: 'anthropic', bg: '#F5F5F5' },
      { name: 'Gemini Pro 2.5',    tokens: 31440, logo: 'google',    bg: '#F5F5F5' },
      { name: 'Llama 3 70B',       tokens: 27390, logo: 'meta',      bg: '#F5F5F5' },
      { name: 'Mistral Large',     tokens: 23810, logo: 'mistral',   bg: '#F5F5F5' },
      { name: 'Claude Sonnet 4',   tokens: 19650, logo: 'anthropic', bg: '#F5F5F5' },
      { name: 'GPT-4 Turbo',       tokens: 15200, logo: 'microsoft', bg: '#F5F5F5' },
      { name: 'Gemini Flash 2.0',  tokens: 11870, logo: 'google',    bg: '#F5F5F5' },
    ],
  },
};

// "Usage by Model" cards shown when Monitoring as = Super Admin (8 cards, self-contained)
const ADMIN_MODEL_CARDS = [
  { name: 'Claude Haiku 6.0', id: 'anthropic/claude-haiku-6.0', logo: 'anthropic', bg: '#F5F5F5', req: 480000, inp: 800000,  tokens: 2100000, out: 1200000 },
  { name: 'Chat GPT 5.5',     id: 'openai/chat-gpt-5.5',        logo: 'openai',    bg: '#F5F5F5', req: 320000, inp: 600000,  tokens: 1500000, out: 880000  },
  { name: 'GPT-4o',           id: 'azure/gpt-4o',               logo: 'microsoft', bg: '#F5F5F5', req: 142780, inp: 318450, tokens: 891230,  out: 572780  },
  { name: 'Claude Opus 4',    id: 'anthropic/claude-opus-4',     logo: 'anthropic', bg: '#F5F5F5', req: 98400,  inp: 210000, tokens: 640000,  out: 430000  },
  { name: 'Gemini Pro 2.5',   id: 'google/gemini-pro-2.5',       logo: 'google',    bg: '#F5F5F5', req: 87600,  inp: 195000, tokens: 580000,  out: 385000  },
  { name: 'Llama 3 70B',      id: 'meta/llama-3-70b',            logo: 'meta',      bg: '#F5F5F5', req: 74200,  inp: 162000, tokens: 490000,  out: 328000  },
  { name: 'Mistral Large',    id: 'mistral/mistral-large',       logo: 'mistral',   bg: '#F5F5F5', req: 61500,  inp: 138000, tokens: 410000,  out: 272000  },
  { name: 'Claude Sonnet 4',  id: 'anthropic/claude-sonnet-4',    logo: 'anthropic', bg: '#F5F5F5', req: 52300,  inp: 118000, tokens: 350000,  out: 232000  },
];

// Shared app state
const state = {
  monitorAs: 'po',
  model:     'all',
  period:    'today',
  dateLabel: '9 Jun 2026',
};
