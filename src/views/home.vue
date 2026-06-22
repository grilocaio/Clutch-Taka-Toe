<template>
  <Header 
      :usuario="usuarioLogado" 
      @abrirLogin="telaAtual = 'login'" 
      @sair="fazerLogout"
      @navegar="navegarPara"
  />
  
  <!-- Página Inicial -->
  <div v-if="telaAtual === 'home'">
      <Hero @buscar="irParaBusca" />
      <br>
      <Cards/>
      <Imagens @verBarbearia="irParaDetalhesBarbeariaPorId" />
  </div>
    
  <!-- Listagem de Barbearias -->
  <Barbearias 
      v-if="telaAtual === 'Barbearias'" 
      @voltar="telaAtual = 'home'"
      @selecionarBarbearia="irParaDetalhesBarbearia"
      :cidade="cidadeDaBusca" 
      :estado="estadoDaBusca" 
  />

  <!-- Detalhes da Barbearia & Agendamento -->
  <BarbeariaDetalhes
      v-if="telaAtual === 'barbearia_detalhe'"
      :barbearia="barbeariaSelecionada"
      :usuarioLogado="usuarioLogado"
      @voltar="telaAtual = 'Barbearias'"
      @irParaLogin="telaAtual = 'login'"
      @agendamentoSucesso="telaAtual = 'client_agendamentos'"
  />

  <!-- Agendamentos do Cliente -->
  <ClienteAgendamentos
      v-if="telaAtual === 'client_agendamentos' && usuarioLogado && usuarioLogado.cargo === 'Cliente'"
      :usuarioLogado="usuarioLogado"
      @voltar="telaAtual = 'home'"
  />

  <!-- Painel do Administrador -->
  <AdminDashboard
      v-if="telaAtual === 'admin_dashboard' && usuarioLogado && usuarioLogado.cargo === 'Administrador'"
      :usuarioLogado="usuarioLogado"
      @voltar="telaAtual = 'home'"
  />

  <!-- Painel do Barbeiro -->
  <BarbeiroDashboard
      v-if="telaAtual === 'barbeiro_dashboard' && usuarioLogado && usuarioLogado.cargo === 'Barbeiro'"
      :usuarioLogado="usuarioLogado"
      @voltar="telaAtual = 'home'"
  />

  <!-- Tela de Perfil do Usuário -->
  <PerfilUsuario
      v-if="telaAtual === 'perfil_usuario' && usuarioLogado"
      :usuarioLogado="usuarioLogado"
      @voltar="telaAtual = 'home'"
      @perfilAtualizado="usuarioObj => usuarioLogado = usuarioObj"
  />

  <!-- Tela de Login -->
  <Login 
      v-if="telaAtual === 'login'" 
      @voltar="telaAtual = 'home'" 
      @loginSucesso="entrarNoSistema"
  />
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Hero from '@/layouts/Hero.vue';
import Imagens from '@/layouts/Imagens.vue';
import Footer from '@/components/Footer.vue';
import Barbearias from '@/views/Barbearias.vue'; 
import Login from '@/views/Login.vue';
import Cards from '@/layouts/Cards.vue';

// Importação das novas telas
import BarbeariaDetalhes from '@/views/BarbeariaDetalhes.vue';
import ClienteAgendamentos from '@/views/ClienteAgendamentos.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import BarbeiroDashboard from '@/views/BarbeiroDashboard.vue';
import PerfilUsuario from '@/views/PerfilUsuario.vue';
import { getBarbearias } from '@/utils/storage';

const telaAtual = ref('home');
const estadoDaBusca = ref('');
const cidadeDaBusca = ref('');

// Usuário logado é um objeto completo: { id, nome, email, cargo, barbeariaId }
const usuarioLogado = ref(null);
const barbeariaSelecionada = ref(null);

onMounted(() => {
    carregarUsuarioLogado();
});

function carregarUsuarioLogado() {
    const userJson = localStorage.getItem('trimly_logado_user');
    if (userJson) {
        try {
            usuarioLogado.value = JSON.parse(userJson);
        } catch (e) {
            usuarioLogado.value = null;
        }
    } else {
        usuarioLogado.value = null;
    }
}

function irParaBusca(estado, cidade) {
    estadoDaBusca.value = estado;
    cidadeDaBusca.value = cidade;
    telaAtual.value = 'Barbearias';
}

function irParaDetalhesBarbearia(barbearia) {
    barbeariaSelecionada.value = barbearia;
    telaAtual.value = 'barbearia_detalhe';
}

function irParaDetalhesBarbeariaPorId(id) {
    const barbearias = getBarbearias();
    const b = barbearias.find(x => x.id === Number(id));
    if (b) {
        barbeariaSelecionada.value = b;
        telaAtual.value = 'barbearia_detalhe';
    }
}

function navegarPara(tela) {
    if (tela === 'Barbearias') {
        telaAtual.value = 'home';
        setTimeout(() => {
            const el = document.getElementById('nossas-barbearias');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    } else {
        telaAtual.value = tela;
    }
}

// Recebe o objeto do Usuário após login bem sucedido
function entrarNoSistema(usuarioObj) {
    usuarioLogado.value = usuarioObj;
    
    // Redireciona o usuário para seu painel correspondente ao logar
    if (usuarioObj.cargo === 'Administrador') {
        telaAtual.value = 'admin_dashboard';
    } else if (usuarioObj.cargo === 'Barbeiro') {
        telaAtual.value = 'barbeiro_dashboard';
    } else {
        telaAtual.value = 'home';
    }
}

// Limpa todas as chaves de sessão e redefine tela
function fazerLogout() {
    localStorage.removeItem('trimly_logado_user');
    localStorage.removeItem('trimly_logado');
    usuarioLogado.value = null;
    telaAtual.value = 'home';
}
</script>