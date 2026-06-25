<template>
  <div class="min-h-screen bg-[#0e1216] text-[#c5c9cd] font-sans antialiased flex flex-col justify-between selection:bg-[#de9b35] selection:text-black">
    <!-- Header -->
    <header class="border-b border-[#1b2228] bg-[#12171c]/90 sticky top-0 z-30 backdrop-blur-md px-4 py-3 shadow-lg">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- Logo com Crosshair -->
          <div class="w-10 h-10 rounded bg-gradient-to-br from-[#de9b35] to-[#f3a93c] flex items-center justify-center text-[#12161a] font-bold text-xl relative shadow-md shadow-[#de9b35]/10 group">
            🎯
            <div class="absolute inset-0 border border-white/20 rounded"></div>
          </div>
          <div>
            <h1 class="text-lg font-black tracking-wider text-white flex items-center gap-1.5 uppercase">
              Clutch Taka Toe
              <span class="text-[10px] bg-[#de9b35] text-black px-1.5 py-0.5 rounded font-black">CS EDITION</span>
            </h1>
            <p class="text-xs text-[#6e767e]">O Jogo da Velha Definitivo de CS:GO & CS2</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="soundEnabled = !soundEnabled" 
            class="p-2 rounded bg-[#1b2228] hover:bg-[#252e37] text-gray-400 hover:text-white transition-colors"
            title="Ativar/Desativar Sons"
          >
            <span v-if="soundEnabled">🔊</span>
            <span v-else>🔇</span>
          </button>
          <button 
            v-if="gameState !== 'setup'" 
            @click="confirmReset" 
            class="text-xs px-3 py-1.5 rounded bg-[#1b2228] hover:bg-[#ef4444] hover:text-white font-bold transition-all border border-gray-700/50"
          >
            Sair do Jogo
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-grow max-w-4xl w-full mx-auto p-4 md:py-8 flex flex-col justify-center items-center">
      
      <!-- SETUP SCREEN -->
      <div v-if="gameState === 'setup'" class="w-full max-w-md bg-[#12171c] border border-[#1b2228] rounded-xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
        <!-- Detalhe decorativo superior -->
        <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-[#de9b35] to-orange-500"></div>

        <div class="text-center mb-6">
          <h2 class="text-2xl font-black text-white tracking-tight uppercase">Escolha o Modo de Jogo</h2>
          <p class="text-sm text-[#8c949c] mt-1">Prepara-te para testar o teu conhecimento sobre a história do CS</p>
        </div>

        <div class="space-y-4">
          <!-- MODO PvP -->
          <button 
            @click="startNewGame('pvp')" 
            class="w-full flex items-center justify-between p-4 rounded-lg bg-[#1b2228] border border-[#2b353e] hover:border-[#de9b35]/80 hover:bg-[#212a32] text-left transition-all duration-200 group"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-gray-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                👥
              </div>
              <div>
                <h3 class="font-bold text-white group-hover:text-[#de9b35] transition-colors">Mesma Tela (Local PvP)</h3>
                <p class="text-xs text-[#8c949c]">Jogue contra um amigo no mesmo computador. CT vs T.</p>
              </div>
            </div>
            <span class="text-[#de9b35] opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
          </button>

          <!-- MODO PvE -->
          <div class="p-4 rounded-lg bg-[#1b2228] border border-[#2b353e] space-y-3">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-gray-600 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div class="flex-grow">
                <h3 class="font-bold text-white">Contra a IA (Solo PvE)</h3>
                <p class="text-xs text-[#8c949c]">Jogue como CT contra os Terroristas controlados pela IA.</p>
              </div>
            </div>

            <!-- Seleção de Dificuldade da IA -->
            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700/40">
              <button 
                v-for="diff in ['facil', 'medio', 'dificil']" 
                :key="diff"
                @click="startNewGame('pve', diff)"
                :class="[
                  'py-2 px-3 text-xs font-bold rounded uppercase tracking-wider text-center transition-all duration-150',
                  diff === 'facil' ? 'bg-green-950/40 text-green-400 hover:bg-green-900/60 border border-green-800/40' : '',
                  diff === 'medio' ? 'bg-amber-950/40 text-amber-400 hover:bg-amber-900/60 border border-amber-800/40' : '',
                  diff === 'dificil' ? 'bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/40' : ''
                ]"
              >
                {{ diff === 'facil' ? 'Fácil' : diff === 'medio' ? 'Médio' : 'Difícil' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estatísticas Rápidas ou Instruções -->
        <div class="mt-6 pt-6 border-t border-[#1b2228] text-center">
          <h4 class="text-xs font-bold text-[#8c949c] uppercase tracking-widest mb-2">Instruções do Jogo</h4>
          <p class="text-xs text-[#6e767e] leading-relaxed">
            Selecione uma casa no tabuleiro e digite um jogador que atenda aos critérios da linha e da coluna. 
            Você tem **3 roubos** para tomar casas já preenchidas pelo seu adversário citando outro jogador válido.
          </p>
        </div>
      </div>

      <!-- PLAYING GAME SCREEN -->
      <div v-else class="w-full flex flex-col items-center space-y-6">
        
        <!-- Scoreboard / Placar -->
        <div class="w-full max-w-lg bg-[#12171c] border border-[#1b2228] rounded-xl p-4 flex items-center justify-between shadow-xl relative overflow-hidden">
          
          <!-- Lado CT (P1) -->
          <div class="flex items-center space-x-3 w-1/3">
            <div 
              class="w-10 h-10 rounded flex items-center justify-center font-bold text-lg relative"
              :class="[
                currentPlayer === 'CT' && winner === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-[#1b2228] text-[#4f79a3]'
              ]"
            >
              🛡️
            </div>
            <div>
              <span class="text-xs font-black tracking-widest text-[#4f79a3] uppercase block">CT (P1)</span>
              <span class="text-white font-black text-xl">{{ scores.CT }}</span>
            </div>
          </div>

          <!-- Placar Central / Turno -->
          <div class="flex flex-col items-center justify-center w-1/3">
            <div class="text-[10px] text-[#6e767e] uppercase font-black tracking-widest mb-1">Rodada</div>
            <div class="bg-[#1b2228] px-4 py-1.5 rounded-full text-white font-extrabold text-sm border border-gray-700/30 flex items-center space-x-2">
              <span :class="currentPlayer === 'CT' ? 'text-blue-400' : 'text-amber-400'">●</span>
              <span>{{ gameMode === 'pve' && currentPlayer === 'T' ? 'IA PENSANDO...' : `TURNO ${currentPlayer}` }}</span>
            </div>
          </div>

          <!-- Lado T (P2 / IA) -->
          <div class="flex items-center justify-end space-x-3 w-1/3 text-right">
            <div>
              <span class="text-xs font-black tracking-widest text-[#d0a040] uppercase block">
                {{ gameMode === 'pve' ? 'IA (T)' : 'T (P2)' }}
              </span>
              <span class="text-white font-black text-xl">{{ scores.T }}</span>
            </div>
            <div 
              class="w-10 h-10 rounded flex items-center justify-center font-bold text-lg"
              :class="[
                currentPlayer === 'T' && winner === null ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-[#1b2228] text-[#d0a040]'
              ]"
            >
              💣
            </div>
          </div>
        </div>

        <!-- TABULEIRO 3x3 -->
        <div class="w-full overflow-x-auto py-2 flex justify-center">
          <div class="grid grid-cols-4 gap-2 md:gap-3 select-none min-w-[340px] max-w-[500px] w-full">
            
            <!-- Célula do Canto (Vazia / Logo) -->
            <div class="aspect-square flex flex-col items-center justify-center bg-[#12171c]/40 border border-[#1b2228]/40 rounded-lg">
              <span class="text-2xl opacity-60">🎯</span>
            </div>

            <!-- Cabeçalhos das Colunas (Col 0, 1, 2) -->
            <div 
              v-for="(col, index) in activeCriteria.cols" 
              :key="col.id" 
              class="aspect-square flex flex-col items-center justify-center text-center p-2 bg-[#12171c] border border-[#1b2228] rounded-lg shadow-md relative group hover:border-[#de9b35]/40 transition-colors"
            >
              <img 
                :src="getImageUrl(col.value, col.type)" 
                :alt="col.label" 
                class="w-10 h-10 object-contain mb-1 rounded" 
              />
              <div class="text-[10px] md:text-xs font-black tracking-wider text-white uppercase leading-tight line-clamp-2">
                {{ col.label }}
              </div>
            </div>

            <!-- Linhas com Cabeçalhos de Linha e Células de Jogo -->
            <template v-for="(row, rIndex) in activeCriteria.rows" :key="row.id">
              
              <!-- Cabeçalho de Linha (Row rIndex) -->
              <div class="aspect-square flex flex-col items-center justify-center text-center p-2 bg-[#12171c] border border-[#1b2228] rounded-lg shadow-md hover:border-[#de9b35]/40 transition-colors">
                <img 
                  :src="getImageUrl(row.value, row.type)" 
                  :alt="row.label" 
                  class="w-10 h-10 object-contain mb-1 rounded" 
                />
                <div class="text-[10px] md:text-xs font-black tracking-wider text-white uppercase leading-tight line-clamp-2">
                  {{ row.label }}
                </div>
              </div>

              <!-- 3 Células de Jogo para essa Linha -->
              <div 
                v-for="cIndex in [0, 1, 2]" 
                :key="cIndex"
                @click="handleCellClick(rIndex * 3 + cIndex)"
                :class="[
                  'aspect-square flex flex-col items-center justify-center text-center rounded-lg border-2 cursor-pointer transition-all duration-200 relative overflow-hidden',
                  getCellClass(rIndex * 3 + cIndex)
                ]"
              >
                <!-- Indicador de Posição de Vitória (Glow) -->
                <div v-if="isInWinPattern(rIndex * 3 + cIndex)" class="absolute inset-0 bg-white/10 animate-pulse"></div>

                <!-- Caso a casa esteja preenchida -->
                <div v-if="board[rIndex * 3 + cIndex] && board[rIndex * 3 + cIndex].player" class="flex flex-col items-center justify-center p-1 w-full h-full relative z-10">
                  <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1e2730] overflow-hidden flex items-center justify-center border-2" :class="board[rIndex * 3 + cIndex].player === 'CT' ? 'border-[#4f79a3]' : 'border-[#d0a040]'">
                    <img 
                      v-if="getPlayerImageUrl(board[rIndex * 3 + cIndex].playerNickname)" 
                      :src="getPlayerImageUrl(board[rIndex * 3 + cIndex].playerNickname)" 
                      class="w-full h-full object-cover" 
                    />
                    <span v-else class="text-xl md:text-2xl">👤</span>
                  </div>
                  <span class="text-xs md:text-sm font-black mt-1 text-white tracking-wide uppercase truncate max-w-full">
                    {{ board[rIndex * 3 + cIndex].playerNickname }}
                  </span>
                  <span class="text-[8px] text-gray-400 font-semibold truncate max-w-full">
                    {{ board[rIndex * 3 + cIndex].playerRealName }}
                  </span>
                  <!-- Tag de quem marcou a casa -->
                  <div class="absolute bottom-1 right-1 text-[8px] px-1 rounded font-black" :class="board[rIndex * 3 + cIndex].player === 'CT' ? 'bg-[#4f79a3]/20 text-[#6da0d6]' : 'bg-[#d0a040]/20 text-[#e0a84c]'">
                    {{ board[rIndex * 3 + cIndex].player }}
                  </div>
                </div>

                <!-- Caso a casa esteja vazia -->
                <div v-else class="flex flex-col items-center justify-center p-2 opacity-40 hover:opacity-100 transition-opacity">
                  <span class="text-2xl mb-1 text-gray-400">+</span>
                  <span class="text-[9px] font-black uppercase text-gray-500 tracking-wider">Escolher</span>
                </div>
              </div>

            </template>

          </div>
        </div>

        <!-- CONTADORES DE ROUBOS & AÇÕES -->
        <div class="w-full max-w-lg bg-[#12171c] border border-[#1b2228] rounded-xl p-3 flex items-center justify-between shadow-md text-xs">
          <div class="flex items-center space-x-1">
            <span class="text-[#6da0d6] font-bold">Roubos CT:</span>
            <div class="flex space-x-1">
              <span v-for="i in 3" :key="i" :class="i <= steals.CT ? 'text-[#6da0d6]' : 'text-gray-600'">⚡</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button 
              @click="skipTurn" 
              :disabled="gameMode === 'pve' && currentPlayer === 'T' || winner !== null"
              class="px-3 py-1.5 rounded bg-[#1b2228] hover:bg-[#252e37] border border-gray-700/40 font-bold transition-all disabled:opacity-50"
            >
              Pular Vez
            </button>
            <button 
              @click="endAsDraw" 
              :disabled="winner !== null"
              class="px-3 py-1.5 rounded bg-[#1b2228] hover:bg-[#de9b35] hover:text-black border border-gray-700/40 font-bold transition-all disabled:opacity-50"
            >
              Forçar Empate
            </button>
          </div>

          <div class="flex items-center space-x-1">
            <span class="text-[#e0a84c] font-bold">Roubos T:</span>
            <div class="flex space-x-1">
              <span v-for="i in 3" :key="i" :class="i <= steals.T ? 'text-[#e0a84c]' : 'text-gray-600'">⚡</span>
            </div>
          </div>
        </div>

        <!-- GAME OVER OVERLAY / ALERTA -->
        <div v-if="winner !== null" class="w-full max-w-lg bg-gradient-to-r p-[1.5px] rounded-xl shadow-2xl transition-all duration-300"
             :class="[
               winner === 'CT' ? 'from-blue-600 to-indigo-600' : '',
               winner === 'T' ? 'from-amber-600 to-orange-600' : '',
               winner === 'draw' ? 'from-gray-600 to-gray-500' : ''
             ]"
        >
          <div class="bg-[#12171c] rounded-xl p-5 text-center">
            <h3 class="text-2xl font-black uppercase text-white tracking-wide">
              {{ winner === 'draw' ? 'Empate Técnico!' : `${winner} VENCEU A RODADA!` }}
            </h3>
            <p class="text-xs text-[#8c949c] mt-1 mb-4">
              {{ winner === 'draw' ? 'Ambos jogaram com garra!' : `O time ${winner} completou 3 em linha e garantiu o round.` }}
            </p>

            <div class="flex justify-center space-x-3">
              <button 
                @click="resetGame" 
                class="px-5 py-2 rounded font-black text-sm uppercase tracking-wider text-black transition-all bg-[#de9b35] hover:bg-[#f3a93c]"
              >
                Próxima Partida
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- GUESS MODAL -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#12171c] border border-[#1b2228] w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-up relative">
        <div class="absolute top-0 left-0 w-full h-[3px] bg-[#de9b35]"></div>

        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-black text-white uppercase tracking-wider">Dê o seu palpite</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-white font-bold text-sm">✕</button>
          </div>

          <!-- Critérios em Destaque -->
          <div class="my-4 p-3 bg-[#1b2228] rounded-lg border border-[#2b353e] flex items-center justify-between text-xs">
            <div class="flex flex-col items-center flex-1">
              <span class="text-[#de9b35] font-black uppercase text-[10px] mb-1">Linha</span>
              <span class="text-white font-bold text-center flex items-center gap-1.5">
                <img :src="getImageUrl(activeCriteria.rows[Math.floor(currentCellIndex / 3)].value, activeCriteria.rows[Math.floor(currentCellIndex / 3)].type)" class="w-5 h-5 object-contain rounded" />
                {{ activeCriteria.rows[Math.floor(currentCellIndex / 3)].label }}
              </span>
            </div>
            <div class="text-gray-600 font-bold mx-2">AND</div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[#de9b35] font-black uppercase text-[10px] mb-1">Coluna</span>
              <span class="text-white font-bold text-center flex items-center gap-1.5">
                <img :src="getImageUrl(activeCriteria.cols[currentCellIndex % 3].value, activeCriteria.cols[currentCellIndex % 3].type)" class="w-5 h-5 object-contain rounded" />
                {{ activeCriteria.cols[currentCellIndex % 3].label }}
              </span>
            </div>
          </div>

          <!-- Tipo de Ação (Nova Jogada ou Roubo) -->
          <div v-if="isStealAttempt" class="mb-3 p-2 bg-amber-950/20 border border-amber-900/40 rounded text-center text-[10px] text-[#e0a84c] font-black uppercase">
            ⚡ ATENÇÃO: TENTATIVA DE ROUBO! VOCÊ PRECISA CITAR UM JOGADOR DIFERENTE DE "{{ board[currentCellIndex].playerNickname }}".
          </div>

          <!-- Feedback de Erro -->
          <div v-if="searchFeedback" class="mb-3 p-2 bg-red-950/40 border border-red-800/40 rounded text-xs text-red-400 font-semibold text-center">
            ❌ {{ searchFeedback }}
          </div>

          <!-- Input de Busca -->
          <div class="relative mt-2">
            <input 
              v-model="searchQuery" 
              @input="onSearchInput"
              @keydown.down.prevent="moveActiveSuggestion(1)"
              @keydown.up.prevent="moveActiveSuggestion(-1)"
              @keydown.enter.prevent="selectActiveSuggestion"
              type="text" 
              placeholder="Digite o nickname (ex: s1mple, FalleN...)" 
              ref="searchInput"
              class="w-full bg-[#1b2228] border border-[#2b353e] focus:border-[#de9b35] text-white rounded-lg px-4 py-2.5 outline-none font-bold text-sm transition-colors"
              autofocus
            />

            <!-- Dropdown de Sugestões -->
            <ul v-if="suggestions.length > 0" class="absolute left-0 w-full mt-1 bg-[#1b2228] border border-[#2b353e] rounded-lg overflow-hidden shadow-2xl z-50 divide-y divide-[#252e37]">
              <li 
                v-for="(player, idx) in suggestions" 
                :key="player.id"
                @click="selectPlayer(player)"
                :class="[
                  'px-4 py-2 flex items-center justify-between text-xs cursor-pointer transition-colors',
                  idx === activeSuggestionIndex ? 'bg-[#de9b35] text-black font-black' : 'text-gray-300 hover:bg-[#212a32]'
                ]"
              >
                <div>
                  <span class="font-extrabold uppercase text-sm block" :class="idx === activeSuggestionIndex ? 'text-black' : 'text-white'">
                    {{ player.nickname }}
                  </span>
                  <span class="opacity-75 text-[10px]">
                    {{ player.name }}
                  </span>
                </div>
                <div class="flex items-center space-x-2 text-[10px]">
                  <span class="px-1.5 py-0.5 rounded bg-black/10 font-bold">
                    {{ player.nationality }}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-6 flex justify-end space-x-2">
            <button @click="closeModal" class="px-4 py-2 text-xs font-bold bg-[#1b2228] hover:bg-[#252e37] rounded-lg transition-colors">
              Cancelar
            </button>
            <button 
              @click="submitGuess"
              :disabled="!selectedPlayerObject"
              class="px-5 py-2 text-xs font-black bg-[#de9b35] hover:bg-[#f3a93c] disabled:opacity-55 text-black rounded-lg transition-colors"
            >
              Confirmar Palpite
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-[#1b2228] bg-[#0e1216] py-4 px-4 text-center text-xs text-[#6e767e]">
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <span>Clutch Taka Toe © 2026. Desenvolvido para Fãs de Counter-Strike.</span>
        <span>Referência de Dados: HLTV.org</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { PLAYERS, getImageUrl, getPlayerImageUrl } from '../utils/csData';
import { generateBoard, isValidAnswer, checkWinner, getAIChoice } from '../utils/gameEngine';

// Estados do Jogo
const gameState = ref('setup'); // 'setup' | 'playing' | 'finished'
const gameMode = ref('pvp'); // 'pvp' | 'pve'
const aiDifficulty = ref('medio'); // 'facil' | 'medio' | 'dificil'

const currentPlayer = ref('CT'); // 'CT' (Azul) | 'T' (Amarelo)
const scores = reactive({ CT: 0, T: 0 });
const steals = reactive({ CT: 3, T: 3 });

// Tabuleiro de 9 posições. Cada item pode ser null ou { player, playerNickname, playerRealName, playerId }
const board = ref(Array(9).fill(null));
const activeCriteria = ref({ rows: [], cols: [] });

const winner = ref(null); // 'CT' | 'T' | 'draw' | null
const winPattern = ref([]);

// Modais e Busca
const showModal = ref(false);
const currentCellIndex = ref(-1);
const searchQuery = ref('');
const suggestions = ref([]);
const activeSuggestionIndex = ref(0);
const selectedPlayerObject = ref(null);
const searchFeedback = ref('');
const isStealAttempt = ref(false);
const searchInput = ref(null);

// Sons
const soundEnabled = ref(true);
let audioCtx = null;

// Inicializa o Áudio do Navegador de forma lazy na primeira interação do usuário
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Emissores de Sons Sintéticos com Web Audio API
function playSound(type) {
  if (!soundEnabled.value) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'steal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'victory') {
      // Fanfarra curta
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.1, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.3);
      });
    }
  } catch (error) {
    console.error("Falha ao reproduzir som", error);
  }
}

// Inicia um novo jogo
function startNewGame(mode, difficulty = 'medio') {
  playSound('click');
  gameMode.value = mode;
  aiDifficulty.value = difficulty;
  
  // Reseta estado da rodada
  winner.value = null;
  winPattern.value = [];
  board.value = Array(9).fill(null);
  steals.CT = 3;
  steals.T = 3;
  currentPlayer.value = 'CT'; // CT sempre começa
  
  // Gera os critérios dinâmicos
  activeCriteria.value = generateBoard();
  gameState.value = 'playing';
}

// Volta para a tela inicial
function confirmReset() {
  playSound('click');
  if (confirm("Tem certeza que deseja sair do jogo atual? Todo progresso será perdido.")) {
    gameState.value = 'setup';
    scores.CT = 0;
    scores.T = 0;
  }
}

// Reseta o tabuleiro para uma nova rodada
function resetGame() {
  playSound('click');
  winner.value = null;
  winPattern.value = [];
  board.value = Array(9).fill(null);
  steals.CT = 3;
  steals.T = 3;
  currentPlayer.value = 'CT';
  activeCriteria.value = generateBoard();
  
  // Se for vez da IA jogar (embora a rodada sempre comece com CT)
  triggerAIMoveIfNeeded();
}

// Pula a vez do jogador
function skipTurn() {
  playSound('click');
  switchTurn();
}

// Força empate
function endAsDraw() {
  playSound('incorrect');
  winner.value = 'draw';
}

// Alterna o turno dos jogadores
function switchTurn() {
  currentPlayer.value = currentPlayer.value === 'CT' ? 'T' : 'CT';
  triggerAIMoveIfNeeded();
}

// Gatilho para a jogada da IA no modo solo
function triggerAIMoveIfNeeded() {
  if (gameMode.value === 'pve' && currentPlayer.value === 'T' && winner.value === null) {
    setTimeout(() => {
      aiPlayTurn();
    }, 1500); // 1.5s de delay simulando pensamento
  }
}

// Jogada da IA
function aiPlayTurn() {
  const emptyIndices = [];
  const stealableIndices = [];

  // Analisa o tabuleiro
  board.value.forEach((cell, idx) => {
    if (cell === null || cell.player === null) {
      emptyIndices.push(idx);
    } else if (cell.player === 'CT' && steals.T > 0) {
      stealableIndices.push(idx);
    }
  });

  // Heurística de decisão simples:
  // 1. Tentar ganhar imediatamente.
  // 2. Bloquear vitória do adversário.
  // 3. Escolher uma célula aleatória.

  let targetIndex = -1;

  // Analisa vitória/bloqueio
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // 1. Verificar se a IA pode ganhar neste turno
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const cells = [board.value[a], board.value[b], board.value[c]];
    const tCount = cells.filter(cell => cell && cell.player === 'T').length;
    const emptyCount = cells.filter(cell => cell === null).length;
    
    if (tCount === 2 && emptyCount === 1) {
      const emptyIdx = [a, b, c].find(idx => board.value[idx] === null);
      if (emptyIdx !== undefined) {
        targetIndex = emptyIdx;
        break;
      }
    }
  }

  // 2. Se não der para ganhar, verificar bloqueio (se CT tem 2 na linha)
  if (targetIndex === -1) {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const cells = [board.value[a], board.value[b], board.value[c]];
      const ctCount = cells.filter(cell => cell && cell.player === 'CT').length;
      const emptyCount = cells.filter(cell => cell === null).length;

      if (ctCount === 2 && emptyCount === 1) {
        const emptyIdx = [a, b, c].find(idx => board.value[idx] === null);
        if (emptyIdx !== undefined) {
          targetIndex = emptyIdx;
          break;
        }
      }
    }
  }

  // 3. Se nenhuma heurística disparou, escolhe uma casa vazia aleatória ou um roubo viável
  if (targetIndex === -1) {
    // 80% de prioridade para casas vazias, 20% para roubo se tiver steals
    if (emptyIndices.length > 0 && (stealableIndices.length === 0 || Math.random() < 0.8)) {
      targetIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (stealableIndices.length > 0) {
      targetIndex = stealableIndices[Math.floor(Math.random() * stealableIndices.length)];
    }
  }

  if (targetIndex === -1) {
    // Sem jogadas possíveis
    skipTurn();
    return;
  }

  // Identifica critérios da célula
  const rowCriterion = activeCriteria.value.rows[Math.floor(targetIndex / 3)];
  const colCriterion = activeCriteria.value.cols[targetIndex % 3];

  // Verifica se é uma tentativa de roubo
  const isSteal = board.value[targetIndex] !== null;

  // IA faz o palpite
  const aiChoice = getAIChoice(rowCriterion, colCriterion, aiDifficulty.value, []);

  if (aiChoice) {
    // Jogada válida!
    if (isSteal) {
      steals.T--;
      playSound('steal');
    } else {
      playSound('correct');
    }

    board.value[targetIndex] = {
      player: 'T',
      playerNickname: aiChoice.nickname,
      playerRealName: aiChoice.name,
      playerId: aiChoice.id
    };

    // Verifica fim de jogo
    checkGameStatus();
  } else {
    // IA errou (ou não soube responder)
    playSound('incorrect');
    switchTurn();
  }
}

// Abre o modal de palpite para uma célula específica
function handleCellClick(index) {
  if (winner.value !== null) return; // Fim de jogo
  if (gameMode.value === 'pve' && currentPlayer.value === 'T') return; // Vez da IA

  const cell = board.value[index];

  // Caso esteja ocupada por mim, não faz nada
  if (cell && cell.player === currentPlayer.value) return;

  // Caso esteja ocupada pelo adversário, verifica se posso roubar
  if (cell && cell.player !== currentPlayer.value) {
    const currentSteals = steals[currentPlayer.value];
    if (currentSteals <= 0) {
      alert("Você não possui mais roubos de casas (Steals) restantes!");
      return;
    }
    isStealAttempt.value = true;
  } else {
    isStealAttempt.value = false;
  }

  playSound('click');
  currentCellIndex.value = index;
  searchQuery.value = '';
  suggestions.value = [];
  selectedPlayerObject.value = null;
  searchFeedback.value = '';
  activeSuggestionIndex.value = 0;
  showModal.value = true;

  // Garante foco no input
  setTimeout(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  }, 100);
}

function closeModal() {
  playSound('click');
  showModal.value = false;
}

// Filtra a lista de jogadores baseada no input de busca
function onSearchInput() {
  const query = searchQuery.value.trim().toLowerCase();
  selectedPlayerObject.value = null;
  searchFeedback.value = '';

  if (query.length < 1) {
    suggestions.value = [];
    activeSuggestionIndex.value = 0;
    return;
  }

  // Filtra por nickname ou nome
  const filtered = PLAYERS.filter(player => {
    return player.nickname.toLowerCase().includes(query) || 
           player.name.toLowerCase().includes(query);
  });

  suggestions.value = filtered.slice(0, 6);
  activeSuggestionIndex.value = 0;
}

// Move o índice ativo nas sugestões
function moveActiveSuggestion(direction) {
  if (suggestions.value.length === 0) return;
  const newIndex = activeSuggestionIndex.value + direction;
  if (newIndex >= 0 && newIndex < suggestions.value.length) {
    activeSuggestionIndex.value = newIndex;
  }
}

// Seleciona a sugestão ativa com Enter
function selectActiveSuggestion() {
  if (suggestions.value.length > 0) {
    selectPlayer(suggestions.value[activeSuggestionIndex.value]);
  }
}

// Seleciona um jogador da lista de sugestões
function selectPlayer(player) {
  playSound('click');
  searchQuery.value = player.nickname;
  selectedPlayerObject.value = player;
  suggestions.value = [];
}

// Submete a resposta dada pelo jogador humano
function submitGuess() {
  if (!selectedPlayerObject.value) return;

  const player = selectedPlayerObject.value;
  const cellIdx = currentCellIndex.value;
  
  // Obter critérios da linha e da coluna
  const rowCriterion = activeCriteria.value.rows[Math.floor(cellIdx / 3)];
  const colCriterion = activeCriteria.value.cols[cellIdx % 3];

  // 2. Valida a resposta contra os critérios
  if (isValidAnswer(player, rowCriterion, colCriterion)) {
    // Certo!
    if (isStealAttempt.value) {
      steals[currentPlayer.value]--;
      playSound('steal');
    } else {
      playSound('correct');
    }

    // Registra a jogada
    board.value[cellIdx] = {
      player: currentPlayer.value,
      playerNickname: player.nickname,
      playerRealName: player.name,
      playerId: player.id
    };
    showModal.value = false;

    // Verifica status da partida
    checkGameStatus();
  } else {
    // Errado! Detalha feedback do erro
    searchFeedback.value = `Incorreto! "${player.nickname}" não atende aos requisitos desta célula.`;
    playSound('incorrect');
    
    // Fecha o modal e passa o turno (errar custa a vez no Tiki-Taka-Toe original)
    setTimeout(() => {
      showModal.value = false;
      switchTurn();
    }, 1500);
  }
}

// Verifica se o tabuleiro possui um vencedor ou se empatou
function checkGameStatus() {
  const result = checkWinner(board.value);

  if (result.won) {
    playSound('victory');
    winner.value = result.winner;
    winPattern.value = result.pattern;
    scores[result.winner]++;
  } else if (result.draw) {
    playSound('incorrect');
    winner.value = 'draw';
  } else {
    // Jogo continua, passa a vez
    switchTurn();
  }
}

// Auxiliares de Estilização Dinâmica
function getCellClass(index) {
  const cell = board.value[index];
  
  // Destaca se o item faz parte da linha vitoriosa
  const isWinning = isInWinPattern(index);
  
  if (!cell || !cell.player) {
    return 'bg-[#12171c]/60 border-[#1b2228] hover:border-[#de9b35]';
  }

  if (cell.player === 'CT') {
    return [
      'border-[#4f79a3] bg-[#2a5078]/25 text-[#6da0d6]',
      isWinning ? 'shadow-[0_0_15px_rgba(79,121,163,0.6)] border-blue-400 scale-[1.03]' : ''
    ];
  } else {
    return [
      'border-[#d0a040] bg-[#a06820]/15 text-[#e0a84c]',
      isWinning ? 'shadow-[0_0_15px_rgba(208,160,64,0.6)] border-amber-400 scale-[1.03]' : ''
    ];
  }
}

function isInWinPattern(index) {
  return winPattern.value.includes(index);
}

onMounted(() => {
  // Inicialização rápida, se desejar carregar históricos salvos
});
</script>

<style scoped>
/* Transições de Modal */
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.9) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

/* Corte de texto longo */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>