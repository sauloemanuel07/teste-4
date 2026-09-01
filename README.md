# Oficlaro

Aplicação web para gestão de oficinas: clientes, veículos, ordens de serviço, orçamento, pagamentos, acompanhamento público, check-in por QR Code e área técnica para mecânicos.

## Executar localmente

O projeto é estático e não exige compilação. Sirva a raiz por HTTP:

```bash
python -m http.server 4173
```

Abra `http://127.0.0.1:4173/`. Recursos que dependem do Firebase usam o projeto configurado no `index.html`; evite criar ou alterar dados reais durante testes locais.

## Validação

Requer Node.js 18 ou superior e não instala dependências:

```bash
npm test
```

O teste verifica a sintaxe do JavaScript, integridade básica do HTML, dependências externas fixadas com SRI e segurança dos links externos.

## Publicação

O GitHub Pages publica a raiz da branch `main` em:

<https://sauloemanuel07.github.io/teste-4/>

Após um push, acompanhe o workflow nativo `pages-build-deployment` no GitHub Actions e valide a URL pública em desktop e mobile.

## Arquitetura e segurança

- Frontend: HTML, CSS e JavaScript sem framework, concentrados em `index.html`.
- Backend: Firebase Authentication, Realtime Database e Storage.
- QR Codes: QRious; leitura por câmera: html5-qrcode.
- O site não deve ser indexado por buscadores porque contém telas operacionais e links privados por token.
- A configuração pública do Firebase no frontend não substitui regras de segurança. As regras de Database/Storage e as restrições da chave devem ser mantidas e testadas no projeto Firebase.
- Não publique backups, tokens de acompanhamento, convites, dados de clientes ou credenciais no repositório.

## Verificação manual recomendada

1. Entrar como gestor e abrir todas as áreas.
2. Criar uma OS, atribuir um mecânico e testar o QR técnico.
3. Aprovar e recusar itens pelo acompanhamento público.
4. Marcar uma foto como pública e confirmar que ela aparece para o cliente.
5. Testar check-in, impressão/PDF, cópia de links e menu mobile.
6. Confirmar que um mecânico desativado perde o acesso às OS atribuídas.
