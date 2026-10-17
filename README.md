# Framew

Site institucional da **Framew**: design gráfico, organização de planilhas e comunicação visual.

Feito em HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

## Estrutura

```
index.html        Página única (navbar, hero, serviços, sobre, Instagram, contato, rodapé)
css/styles.css    Estilos (tokens de design no topo do arquivo)
js/config.js      Dados oficiais da empresa (Instagram, WhatsApp, e-mail, formulário)
js/main.js        Menu mobile, animações de rolagem, dados configuráveis e formulário
assets/           Favicon
```

## Configuração

Edite `js/config.js` com os dados **oficiais** da Framew:

| Campo             | Exemplo                               | Efeito                                         |
| ----------------- | ------------------------------------- | ---------------------------------------------- |
| `instagramUrl`    | `https://www.instagram.com/perfil/`   | Mostra o botão "Acompanhe no Instagram" e o link no rodapé |
| `instagramHandle` | `perfil`                              | Exibe o @ na seção Instagram                   |
| `whatsappNumber`  | `5511999999999`                       | Mostra o botão de WhatsApp e o link no rodapé  |
| `email`           | `contato@dominio.com.br`              | Mostra o e-mail na seção de contato e no rodapé |
| `formEndpoint`    | `https://formspree.io/f/xxxxxxx`      | Envia o formulário de verdade (POST em JSON)   |

Campos vazios escondem o elemento correspondente, então o site nunca mostra um link ou botão que não funciona.

### Como o formulário envia

1. Com `formEndpoint`, a mensagem é enviada ao serviço (Formspree, Getform, Basin ou uma API própria) e o site mostra uma mensagem de sucesso ou de erro.
2. Sem endpoint, mas com `whatsappNumber`, o WhatsApp abre com a mensagem pronta para enviar.
3. Sem endpoint nem WhatsApp, mas com `email`, o app de e-mail do visitante abre com a mensagem pronta.
4. Sem nenhum canal, o formulário fica oculto e aparece um aviso de que o contato está em configuração.

Os botões "Solicitar informações" dos cards já selecionam o serviço correspondente no formulário.

## Rodando localmente

Abra `index.html` no navegador ou sirva a pasta:

```bash
npx http-server .
```

## Publicação

Por ser um site estático, ele pode ser publicado em GitHub Pages, Netlify, Vercel ou qualquer hospedagem de arquivos.
