/**
 * Configuração da Framew
 * ------------------------------------------------------------------
 * Preencha os campos abaixo com os dados OFICIAIS da empresa.
 * Campos vazios ("") fazem o site esconder automaticamente o botão,
 * link ou informação correspondente — nada é exibido sem um dado real.
 */
window.FRAMEW_CONFIG = {
  // URL completa do perfil oficial. Ex.: "https://www.instagram.com/seu_perfil/"
  instagramUrl: "",

  // Nome de usuário exibido no site (sem @). Ex.: "seu_perfil"
  instagramHandle: "",

  // Número do WhatsApp com DDI e DDD, apenas dígitos. Ex.: "5511999999999"
  whatsappNumber: "",

  // E-mail de contato oficial. Ex.: "contato@seudominio.com.br"
  email: "",

  // Endpoint para envio real do formulário (ex.: Formspree, Getform, Basin
  // ou uma API própria) que aceite POST em JSON e responda com status 2xx.
  // Ex.: "https://formspree.io/f/xxxxxxxx"
  // Sem endpoint, o formulário envia a mensagem pelo WhatsApp ou e-mail
  // configurados acima. Sem nenhum canal, o formulário fica oculto.
  formEndpoint: "",
};
