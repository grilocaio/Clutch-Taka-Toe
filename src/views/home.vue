<template>
  <Header />
  
  <div v-if="telaAtual === 'home'">
      <Hero @buscar="irParaBusca" />
      <Imagens />
  </div>

  <Barbearias 
      v-if="telaAtual === 'Barbearias'" 
      @voltar="telaAtual = 'home'"
      :cidade="cidadeDaBusca" 
      :estado="estadoDaBusca" 
  />

  <Footer />
</template>

<script setup>
  import { ref } from 'vue';
  import Header from '@/components/Header.vue';
  import Hero from '@/layouts/Hero.vue';
  import Imagens from '@/layouts/Imagens.vue';
  import Footer from '@/components/Footer.vue';
  // Confirme se o caminho do seu arquivo Barbearias.vue está correto aqui
  import Barbearias from '@/views/Barbearias.vue'; 

  // Variáveis que vão controlar o que aparece na tela
  const telaAtual = ref('home');
  const estadoDaBusca = ref('');
  const cidadeDaBusca = ref('');

  // Função que recebe a informação do Hero e faz a troca de tela
  function irParaBusca(estado, cidade) {
      estadoDaBusca.value = estado;
      cidadeDaBusca.value = cidade;
      telaAtual.value = 'Barbearias';
  }
</script>