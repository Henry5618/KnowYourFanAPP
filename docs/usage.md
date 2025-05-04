💻 Guia de Uso - Know Your Fan App

Este guia detalha como interagir com a interface da aplicação "Know Your Fan" após a configuração e execução inicial.

## ⚙️ Pré-requisitos

*   O servidor **backend** Flask deve estar em execução (na porta 5000).
*   O arquivo `frontend/index.html` deve estar aberto diretamente no seu navegador web (usando o caminho `file:///...`).

## 🗺️ Fluxo Geral de Uso

1.  **Carregar ou Criar Usuário:** A aplicação começa com foco no campo `CPF`.
    *   Digite um CPF válido (o formato `XXX.XXX.XXX-XX` será aplicado automaticamente) e clique em **"Carregar Dados por CPF"**.
    *   **Se encontrado:** Os dados do usuário preencherão o formulário, o campo `CPF` será bloqueado, e as seções secundárias (Validação, Redes Sociais, etc.) serão exibidas.
    *   **Se NÃO encontrado:** Mensagem "CPF não cadastrado..." será exibida. Campos como `Nome Completo`, `E-mail` ficam habilitados para criar um novo usuário ao clicar em **"Salvar Informações Básicas"**.

2.  **Interagir com Seções (Após Carregar/Criar):**
    *   **Atualizar Dados Básicos:** Edite campos (exceto CPF) e clique em **"Salvar Informações Básicas"**.
    *   **Validar ID:** Faça upload (`.jpg`, `.png`, `.pdf`) e clique em **"Enviar Documento"**. Depois, clique em **"Validar ID (Simular AI)"**.
    *   **Redes Sociais:** Insira URLs válidas, clique em **"Salvar Links Sociais"**. Depois, clique em **"Analisar Atividade Social (Simular AI)"**.
    *   **Perfis E-sports:** Insira URLs válidas, clique em **"Salvar Links de Perfis"**. Depois, clique em **"Validar Relevância Perfis (Simular AI)"** (ciente dos possíveis erros 403).

3.  **Visualizar Resumo:** A seção **"Resumo do Perfil"** mostra os dados formatados do usuário após cada salvamento bem-sucedido.

## 🔍 Guia das Seções

### 1. Informações Básicas

*   **CPF:** Campo para buscar usuário ou iniciar criação. Formatação automática. Fica bloqueado após carregar.
*   **E-mail:** Obrigatório para criar/salvar.
*   **Nome Completo:** Obrigatório para criar/salvar.
*   **Outros Campos:** Preencha conforme desejado. Use vírgulas para separar múltiplos itens (Interesses, Eventos, Compras).
*   **Salvar Informações Básicas:** Botão para criar (se CPF+Email inéditos) ou atualizar usuário existente.

### 2. Validação de Identidade (AI Simulada)

*   **Upload:** Use **"Escolher arquivo"** e depois **"Enviar Documento"**.
*   **Validar ID:** Botão habilitado após envio. Clique para obter um status simulado (`Documento Validado...` ou `Falha na Validação...`).
*   **Natureza:** Validação **simulada** (resultado aleatório).

### 3. Redes Sociais e Análise (AI Simulada)

*   **Salvar Links:** Preencha com URLs válidas (começando com `http://` ou `https://`) e clique em **"Salvar Links Sociais"**.
*   **Analisar:** Botão habilitado após salvar. Clique para análise simulada baseada em keywords e exibição formatada do resultado.
*   **Natureza:** Análise **simulada**. Não usa APIs reais. Valida formato básico da URL.

### 4. Perfis em Sites de E-sports e Análise (AI Simulada)

*   **Salvar Links:** Insira URLs válidas e clique em **"Salvar Links de Perfis"**.
*   **Validar Relevância:** Botão habilitado após salvar. Inicia simulação de web scraping.
*   **Natureza:** Análise **simulada** via scraping.
    *   **Atenção aos Erros:** É **esperado** que sites como HLTV retornem erros **"Bloqueado (403)"**. Isso é parte da simulação das dificuldades de scraping.
    *   Resultados mostrarão status como `Relevante`, `Não Relevante` ou os erros por site.

### 5. Resumo do Perfil

*   Exibe os dados atuais do usuário de forma formatada e legível, atualizada após cada salvamento.

## 📊 Mensagens de Status

Fique atento às mensagens coloridas que aparecem após as ações:

*   **Verde (`success`):** Operação bem-sucedida.
*   **Vermelho (`error`):** Falha na operação (a mensagem detalha o motivo).
*   **Azul (`info`):** Informação ou processamento em andamento.

## ⚠️ Disclaimer Final: Simulação

Reforçando: As funcionalidades de validação de ID, análise social e análise de relevância de perfis **são simulações** criadas para demonstrar o fluxo onde a IA seria integrada, mas **não utilizam IA real**.