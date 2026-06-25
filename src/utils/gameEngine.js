import { PLAYERS, CRITERIA_POOL } from './csData';

// Verifica se um jogador atende a um critério específico
export function matchCriterion(player, criterion) {
  if (!player || !criterion) return false;

  switch (criterion.type) {
    case 'team':
      return player.teams.some(t => t === criterion.value);
    case 'nationality':
      return player.nationality === criterion.value;
    case 'teammate':
      if (player.nickname === criterion.value || player.id === criterion.value) return false;
      return player.teammates.includes(criterion.value);
    case 'coach':
      return player.coaches.includes(criterion.value);
    case 'achievement':
      if (criterion.value === 'multiMajor') return player.majorsCount >= 2;
      return !!player[criterion.value];
    default:
      return false;
  }
}

// Verifica se um jogador atende a ambos os critérios de uma célula (linha e coluna)
export function isValidAnswer(player, rowCriterion, colCriterion) {
  return matchCriterion(player, rowCriterion) && matchCriterion(player, colCriterion);
}

// Retorna todas as respostas possíveis para uma célula
export function getPossibleAnswers(rowCriterion, colCriterion) {
  return PLAYERS.filter(player => isValidAnswer(player, rowCriterion, colCriterion));
}

// Embaralha um array (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Verifica se dois critérios (um de linha, outro de coluna) criam uma célula impossível:
// Duas nacionalidades diferentes nunca podem ser atendidas pelo mesmo jogador
function criteriaMightConflict(rowCrit, colCrit) {
  if (rowCrit.id === colCrit.id) return true;
  if (rowCrit.type === 'nationality' && colCrit.type === 'nationality' && rowCrit.value !== colCrit.value) return true;
  return false;
}

// Valida um board completo: sem conflitos E todas as 9 células com >= minSolutions respostas
function validateBoard(rows, cols, minSolutions = 1) {
  // Verifica conflitos entre todos os pares (row, col)
  for (const row of rows) {
    for (const col of cols) {
      if (criteriaMightConflict(row, col)) return null;
    }
  }
  // Verifica se cada célula tem respostas suficientes
  let minAnswers = Infinity;
  let totalAnswers = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const answers = getPossibleAnswers(rows[r], cols[c]);
      if (answers.length < minSolutions) return null;
      if (answers.length < minAnswers) minAnswers = answers.length;
      totalAnswers += answers.length;
    }
  }
  return { minAnswers, totalAnswers };
}

// ======================================================================
// PREDEFINED BOARDS — todos validados manualmente para garantir que:
// 1. Não há conflito de nacionalidade (linha nac X ≠ coluna nac Y)
// 2. Todas as 9 células têm pelo menos 1 resposta válida no banco de dados
// ======================================================================
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
  // Board B: Fnatic/G2/FaZe × Suécia/Major/RobbaN — sem nacionalidade no conflito
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
  // Board C: Astralis/NIP/Fnatic × Suécia/Dinamarca/Major — duas nac. DIFERENTES nas colunas,
  //          mas nenhuma linha é nac., então não conflita
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
  // Board D: NAVI/Spirit/VP × Rússia/Major/Top20 — linhas são times, sem conflito de nac.
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
  // Board G: Liquid/FURIA/MIBR × Brasil/Major/zonis coach
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
  // Board H: FaZe/NAVI/G2 × Jogou com s1mple/Campeão de Cologne/Top20
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

// Histórico de boards recentes para evitar repetição
const recentBoards = [];
const MAX_RECENT = 12;

function boardSignature(rows, cols) {
  return [...rows.map(r => r.id), ...cols.map(c => c.id)].sort().join('|');
}

// Gera uma grade 3x3 de critérios válidos com variedade
export function generateBoard() {
  // Categorias separadas
  const allTeams        = CRITERIA_POOL.filter(c => c.type === 'team');
  const allNationalities= CRITERIA_POOL.filter(c => c.type === 'nationality');
  const allAchievements = CRITERIA_POOL.filter(c => c.type === 'achievement');
  const allCoaches      = CRITERIA_POOL.filter(c => c.type === 'coach');
  const allTeammates    = CRITERIA_POOL.filter(c => c.type === 'teammate');

  // Estratégias de combinação (rowTypes, colTypes)
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
    team: allTeams, nationality: allNationalities,
    achievement: allAchievements, coach: allCoaches, teammate: allTeammates
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

  // Fallback: usa predefined boards VALIDADOS (rejeita conflitantes)
  console.warn('[generateBoard] Usando fallback pré-definido.');
  
  // Valida os predefined boards antes de usar
  const validPredefined = PREDEFINED_BOARDS.filter(b => {
    const sig = boardSignature(b.rows, b.cols);
    if (recentBoards.includes(sig)) return false;
    const score = validateBoard(b.rows, b.cols, 1);
    return score !== null;
  });

  const fallback = validPredefined.length > 0
    ? validPredefined[Math.floor(Math.random() * validPredefined.length)]
    : PREDEFINED_BOARDS[Math.floor(Math.random() * PREDEFINED_BOARDS.length)];

  const sig = boardSignature(fallback.rows, fallback.cols);
  recentBoards.push(sig);
  if (recentBoards.length > MAX_RECENT) recentBoards.shift();
  return fallback;
}

// Verifica se há um vencedor no tabuleiro
export function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] && board[a].player &&
      board[b] && board[b].player &&
      board[c] && board[c].player &&
      board[a].player === board[b].player &&
      board[a].player === board[c].player
    ) {
      return { won: true, winner: board[a].player, pattern };
    }
  }

  const isFull = board.every(cell => cell !== null && cell.player !== null);
  if (isFull) return { draw: true };

  return { won: false };
}

// IA: escolhe jogador para uma célula baseado na dificuldade
export function getAIChoice(rowCriterion, colCriterion, difficulty, usedPlayerIds = []) {
  const possibleAnswers = getPossibleAnswers(rowCriterion, colCriterion)
    .filter(p => !usedPlayerIds.includes(p.id));

  if (possibleAnswers.length === 0) return null;

  let hitRate = 0.4;
  if (difficulty === 'medio') hitRate = 0.7;
  else if (difficulty === 'dificil') hitRate = 0.95;

  if (Math.random() < hitRate) {
    return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
  } else {
    if (Math.random() < 0.5) {
      const invalid = PLAYERS.filter(p =>
        !isValidAnswer(p, rowCriterion, colCriterion) && !usedPlayerIds.includes(p.id)
      );
      if (invalid.length > 0) {
        return invalid[Math.floor(Math.random() * invalid.length)];
      }
    }
    return null;
  }
}
