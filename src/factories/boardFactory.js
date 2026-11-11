import { PLAYERS, CRITERIA_POOL } from '../utils/csData.js';
import { evaluateCriterion } from '../evaluators/criterionEvaluators.js';

/**
 * Padrão Factory Method - BoardFactory
 * Encapsula a criação, seleção e validação de tabuleiros 3x3 para o Clutch Taka Toe.
 */

// Tabuleiros Pré-definidos Validados (Fallback seguro e variados)
const PREDEFINED_BOARDS = [
  // Board A: Grandes orgs × conquistas clássicas
  {
    rows: [
      { id: "team_faze",    type: "team", value: "FaZe Clan",   label: "FaZe Clan",   icon: "❌" },
      { id: "team_navi",    type: "team", value: "NAVI",         label: "NAVI",         icon: "🎮" },
      { id: "team_astralis",type: "team", value: "Astralis",     label: "Astralis",     icon: "⭐" }
    ],
    cols: [
      { id: "ach_major",    type: "achievement", value: "majorChampion",  label: "Campeão de Major",  icon: "🏆" },
      { id: "ach_hltv_top20",type:"achievement", value: "hltvTop20",       label: "TOP 20 HLTV",       icon: "🔥" },
      { id: "coach_blade",  type: "coach",       value: "blade",           label: "Treinado por B1ad3",icon: "🧠" }
    ]
  },
  // Board B: Fnatic/G2/FaZe × Suécia/Major/RobbaN
  {
    rows: [
      { id: "team_fnatic",  type: "team", value: "Fnatic",       label: "Fnatic",       icon: "🧡" },
      { id: "team_g2",      type: "team", value: "G2 Esports",   label: "G2 Esports",   icon: "👑" },
      { id: "team_faze",    type: "team", value: "FaZe Clan",    label: "FaZe Clan",    icon: "❌" }
    ],
    cols: [
      { id: "nat_se",       type: "nationality", value: "Suécia",          label: "Suécia",            icon: "🇸🇪" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",   label: "Campeão de Major",  icon: "🏆" },
      { id: "coach_robban", type: "coach",       value: "RobbaN",          label: "Treinado por RobbaN",icon:"🎓" }
    ]
  },
  // Board C: Astralis/NIP/Fnatic × Suécia/Dinamarca/Major
  {
    rows: [
      { id: "team_astralis",type: "team", value: "Astralis",     label: "Astralis",     icon: "⭐" },
      { id: "team_nip",     type: "team", value: "Ninjas in Pyjamas", label: "NIP",    icon: "💛" },
      { id: "team_fnatic",  type: "team", value: "Fnatic",       label: "Fnatic",       icon: "🧡" }
    ],
    cols: [
      { id: "nat_se",       type: "nationality", value: "Suécia",          label: "Suécia",            icon: "🇸🇪" },
      { id: "nat_dk",       type: "nationality", value: "Dinamarca",       label: "Dinamarca",         icon: "🇩🇰" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",   label: "Campeão de Major",  icon: "🏆" }
    ]
  },
  // Board D: NAVI/Spirit/VP × Rússia/Major/Top20
  {
    rows: [
      { id: "team_navi",    type: "team", value: "NAVI",         label: "NAVI",         icon: "🎮" },
      { id: "team_spirit",  type: "team", value: "Team Spirit",  label: "Team Spirit",  icon: "🐉" },
      { id: "team_vp",      type: "team", value: "Virtus.pro",   label: "Virtus.pro",   icon: "🐻" }
    ],
    cols: [
      { id: "nat_ru",       type: "nationality", value: "Rússia",          label: "Rússia",            icon: "🇷🇺" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",   label: "Campeão de Major",  icon: "🏆" },
      { id: "ach_hltv_top20",type:"achievement", value: "hltvTop20",       label: "TOP 20 HLTV",       icon: "🔥" }
    ]
  },
  // Board E: FaZe/SK/Liquid × Brasil/FalleN/Major
  {
    rows: [
      { id: "team_faze",    type: "team", value: "FaZe Clan",   label: "FaZe Clan",   icon: "❌" },
      { id: "team_sk",      type: "team", value: "SK Gaming",   label: "SK Gaming",   icon: "🏴" },
      { id: "team_liquid",  type: "team", value: "Team Liquid", label: "Team Liquid", icon: "🐴" }
    ],
    cols: [
      { id: "nat_br",       type: "nationality", value: "Brasil",          label: "Brasil",            icon: "🇧🇷" },
      { id: "play_fallen",  type: "teammate",    value: "FalleN",          label: "Jogou com FalleN",  icon: "👑" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",   label: "Campeão de Major",  icon: "🏆" }
    ]
  },
  // Board F: G2/Vitality/Astralis × Major/Top20/Top1
  {
    rows: [
      { id: "team_g2",      type: "team", value: "G2 Esports",  label: "G2 Esports",  icon: "👑" },
      { id: "team_vitality",type: "team", value: "Vitality",    label: "Vitality",    icon: "🐝" },
      { id: "team_astralis",type: "team", value: "Astralis",    label: "Astralis",    icon: "⭐" }
    ],
    cols: [
      { id: "ach_major",    type: "achievement", value: "majorChampion",  label: "Campeão de Major",  icon: "🏆" },
      { id: "ach_hltv_top20",type:"achievement", value: "hltvTop20",      label: "TOP 20 HLTV",       icon: "🔥" },
      { id: "ach_hltv_top1", type:"achievement", value: "hltvTop1",       label: "TOP 1 HLTV",        icon: "👑" }
    ]
  },
  // Board G: Liquid/FURIA/MIBR × Brasil/Major/guerri coach
  {
    rows: [
      { id: "team_liquid",  type: "team", value: "Team Liquid", label: "Team Liquid", icon: "🐴" },
      { id: "team_furia",   type: "team", value: "FURIA",       label: "FURIA",       icon: "🐆" },
      { id: "team_mibr",    type: "team", value: "MIBR",        label: "MIBR",        icon: "🇧🇷" }
    ],
    cols: [
      { id: "nat_br",       type: "nationality", value: "Brasil",         label: "Brasil",           icon: "🇧🇷" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",  label: "Campeão de Major", icon: "🏆" },
      { id: "coach_guerri", type: "coach",       value: "guerri",         label: "Treinado por guerri",icon:"🎮"}
    ]
  },
  // Board H: FaZe/NAVI/Liquid × s1mple/Cologne/Major
  {
    rows: [
      { id: "team_faze",    type: "team", value: "FaZe Clan",   label: "FaZe Clan",   icon: "❌" },
      { id: "team_navi",    type: "team", value: "NAVI",         label: "NAVI",         icon: "🎮" },
      { id: "team_liquid",  type: "team", value: "Team Liquid", label: "Team Liquid", icon: "🐴" }
    ],
    cols: [
      { id: "play_s1mple",  type: "teammate",    value: "s1mple",          label: "Jogou com s1mple", icon: "🐐" },
      { id: "ach_cologne",  type: "achievement", value: "cologneChampion", label: "Campeão de Cologne",icon:"🏰" },
      { id: "ach_major",    type: "achievement", value: "majorChampion",   label: "Campeão de Major", icon: "🏆" }
    ]
  }
];

const recentBoards = [];
const MAX_RECENT = 12;

function boardSignature(rows, cols) {
  return [...rows.map(r => r.id), ...cols.map(c => c.id)].sort().join('|');
}

function isValidAnswerForCell(player, rowCriterion, colCriterion) {
  return evaluateCriterion(player, rowCriterion) && evaluateCriterion(player, colCriterion);
}

function countPossibleAnswers(rowCriterion, colCriterion) {
  return PLAYERS.filter(p => isValidAnswerForCell(p, rowCriterion, colCriterion)).length;
}

function criteriaMightConflict(rowCrit, colCrit) {
  if (rowCrit.id === colCrit.id) return true;
  if (rowCrit.type === 'nationality' && colCrit.type === 'nationality' && rowCrit.value !== colCrit.value) return true;
  return false;
}

function validateBoard(rows, cols, minSolutions = 1) {
  for (const row of rows) {
    for (const col of cols) {
      if (criteriaMightConflict(row, col)) return null;
    }
  }
  let minAnswers = Infinity;
  let totalAnswers = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const count = countPossibleAnswers(rows[r], cols[c]);
      if (count < minSolutions) return null;
      if (count < minAnswers) minAnswers = count;
      totalAnswers += count;
    }
  }
  return { minAnswers, totalAnswers };
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createBoard() {
  const allTeams        = CRITERIA_POOL.filter(c => c.type === 'team');
  const allNationalities= CRITERIA_POOL.filter(c => c.type === 'nationality');
  const allAchievements = CRITERIA_POOL.filter(c => c.type === 'achievement');
  const allCoaches      = CRITERIA_POOL.filter(c => c.type === 'coach');
  const allTeammates    = CRITERIA_POOL.filter(c => c.type === 'teammate');

  const strategies = [
    { rowTypes: ['team', 'team', 'team'],        colTypes: ['achievement', 'achievement', 'nationality'] },
    { rowTypes: ['team', 'team', 'team'],        colTypes: ['achievement', 'coach', 'nationality'] },
    { rowTypes: ['team', 'team', 'team'],        colTypes: ['achievement', 'teammate', 'nationality'] },
    { rowTypes: ['team', 'team', 'team'],        colTypes: ['achievement', 'achievement', 'coach'] },
    { rowTypes: ['team', 'team', 'team'],        colTypes: ['achievement', 'achievement', 'teammate'] },
    { rowTypes: ['team', 'team', 'nationality'], colTypes: ['team', 'achievement', 'achievement'] },
    { rowTypes: ['team', 'team', 'nationality'], colTypes: ['team', 'achievement', 'coach'] },
    { rowTypes: ['team', 'team', 'achievement'], colTypes: ['team', 'nationality', 'achievement'] },
    { rowTypes: ['team', 'team', 'achievement'], colTypes: ['team', 'achievement', 'coach'] },
    { rowTypes: ['team', 'team', 'coach'],       colTypes: ['team', 'nationality', 'achievement'] },
  ];

  const poolMap = {
    team: allTeams,
    nationality: allNationalities,
    achievement: allAchievements,
    coach: allCoaches,
    teammate: allTeammates
  };

  const buildCriteria = (types, usedIds) => {
    const result = [];
    for (const type of types) {
      const pool = shuffle(poolMap[type]);
      const crit = pool.find(c => !usedIds.has(c.id));
      if (!crit) return null;
      result.push(crit);
      usedIds.add(crit.id);
    }
    return result;
  };

  const maxAttempts = 600;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const usedIds = new Set();
    
    const rows = buildCriteria(strategy.rowTypes, usedIds);
    if (!rows) continue;
    const cols = buildCriteria(strategy.colTypes, usedIds);
    if (!cols) continue;

    const score = validateBoard(rows, cols, 1);
    if (!score) continue;

    const sig = boardSignature(rows, cols);
    if (recentBoards.includes(sig)) continue;

    recentBoards.push(sig);
    if (recentBoards.length > MAX_RECENT) recentBoards.shift();
    return { rows, cols };
  }

  // Fallback para tabuleiros pré-definidos
  const validPredefined = PREDEFINED_BOARDS.filter(b => {
    const sig = boardSignature(b.rows, b.cols);
    if (recentBoards.includes(sig)) return false;
    return validateBoard(b.rows, b.cols, 1) !== null;
  });

  const selected = validPredefined.length > 0
    ? validPredefined[Math.floor(Math.random() * validPredefined.length)]
    : PREDEFINED_BOARDS[Math.floor(Math.random() * PREDEFINED_BOARDS.length)];

  const enrichCriterion = (crit) => CRITERIA_POOL.find(c => c.id === crit.id) || crit;
  const fallback = {
    rows: selected.rows.map(enrichCriterion),
    cols: selected.cols.map(enrichCriterion)
  };

  const sig = boardSignature(fallback.rows, fallback.cols);
  recentBoards.push(sig);
  if (recentBoards.length > MAX_RECENT) recentBoards.shift();
  return fallback;
}

export default { createBoard };
