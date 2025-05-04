# 🎯 Know Your Fan

Uma plataforma simulada para coletar informações sobre fãs de e-sports, permitindo a um clube conhecer melhor seu público e oferecer experiências personalizadas.

## 📚 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Pré-requisitos](#-pré-requisitos)
* [Instalação](#-instalação)
* [Como Usar](#-como-usar)
* [Limitações Conhecidas](#️-limitações-conhecidas)
* [Contribuição](#-contribuição)
* [Licença](#-licença)
* [Contato](#-contato)

## 📝 Sobre o Projeto

Este projeto simula uma plataforma "Know Your Fan", uma estratégia utilizada por clubes de e-sports para coletar informações sobre seus fãs. O objetivo é permitir ao clube conhecer melhor seu público e, assim, oferecer experiências e serviços mais personalizados e exclusivos. A aplicação permite o cadastro de dados básicos (incluindo e-mail obrigatório), upload de documentos, vinculação de redes sociais e perfis de jogos, realizando análises simuladas (onde IA seria integrada) para entender o engajamento e relevância do fã.

## 🎯 Funcionalidades

*   **Coletar dados básicos:** Nome, E-mail, CPF, endereço e informações sobre interesses, atividades, eventos e compras relacionados a e-sports.
*   **Upload de documentos:** Permite enviar documentos de identidade (ex: PDF, JPG).
*   **Simulação de Validação de ID:** Lógica básica que representa onde uma IA seria integrada para validar o documento.
*   **Vinculação de Redes Sociais:** Associa perfis (Twitter, Twitch, Instagram) ao usuário, com validação básica de URL.
*   **Simulação de Análise Social:** Busca por *keywords* de e-sports nos links/handles (simulando IA/NLP) e exibe resultado formatado.
*   **Vinculação de Perfis E-sports:** Associa perfis de sites como HLTV, VLR, Liquipedia, com validação de URL.
*   **Simulação de Análise de Relevância:** Tenta analisar o conteúdo dos perfis via web scraping básico e busca por keywords, tratando erros comuns (403) e exibindo resultado formatado.
*   **Persistência de Dados:** Armazena todas as informações em um banco de dados SQLite.
*   **Visualização de Resumo:** Apresenta um resumo formatado e legível dos dados coletados para o perfil.

**Importante: Simulação de IA**

Todas as funcionalidades que envolvem "Inteligência Artificial" (Validação de ID, Análise Social, Análise de Relevância de Perfis) são **SIMULADAS** neste protótipo. Elas utilizam lógica Python simplificada para demonstrar o fluxo, mas **não** utilizam modelos de Machine Learning complexos ou APIs de IA externas.

## 🛠 Tecnologias Utilizadas

*   **Backend:** Python 3, Flask, Flask-SQLAlchemy, Flask-CORS
*   **Banco de Dados:** SQLite
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
*   **Simulação AI:** Lógica Python, `requests`, `BeautifulSoup4`

## ⚙️ Pré-requisitos

*   Python 3.7+
*   `pip` (gerenciador de pacotes Python)
*   Git (opcional, se clonar o repositório)

## 🚀 Instalação

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-seu-repositorio-aqui>
    cd KnowYourFanApp
    ```

2.  **Navegue até a pasta do backend:**

    ```bash
    cd backend
    ```

3.  **Crie e ative um ambiente virtual:**

    ```bash
    # Criar venv
    python -m venv venv
    # Ativar venv (Exemplos)
    # Windows (cmd/powershell):
    .\venv\Scripts\activate
    # Linux/macOS (bash/zsh):
    source venv/bin/activate
    ```

4.  **Instale as dependências (com o venv ativado):**
    ```bash
    pip install -r requirements.txt
    ```

5.  **(Importante)** Se for a primeira execução ou se você modificou o modelo (`models.py`), **delete o arquivo `instance/app.db`** (se ele existir) antes de iniciar o servidor. Isso garantirá que o banco seja criado com a estrutura correta (incluindo a coluna de e-mail). **Atenção: isso apagará dados existentes.**

    ```bash
    # Exemplo (Opcional - faça manualmente no explorador de arquivos se preferir):
    # Windows: del instance\app.db
    # Linux/macOS: rm instance/app.db
    ```

## 💻 Como Usar

1.  **Execute o servidor Flask (na pasta `backend`, com o venv ativado):**

    ```bash
    python run.py
    ```
    O backend iniciará, geralmente em `http://127.0.0.1:5000/`. Mantenha este terminal aberto.

2.  **Abra o Frontend:**

    Navegue até a pasta `frontend/`.
    Abra o arquivo `index.html` **diretamente no seu navegador web** (ex: duplo clique ou usando "Abrir arquivo...").

3.  **Interaja com a Aplicação:**

    Para instruções detalhadas sobre como usar cada seção da interface (cadastro, upload, análises, etc.), consulte o **Guia de Uso**:
    ➡️ **[Guia de Uso - Como interagir com a Aplicação (docs/usage.md)](docs/usage.md)** ⬅️

## ⚠️ Limitações Conhecidas

*   **Simulação de IA:** Conforme mencionado, as partes de IA são simulações básicas.
*   **Análise de Perfil (Web Scraping):** A tentativa de analisar perfis em sites externos (HLTV, etc.) usa web scraping simples e pode ser bloqueada (Erro 403), demonstrando uma limitação real.
*   **Segurança:** Este é um protótipo sem medidas de segurança robustas (autenticação, sanitização completa de inputs, etc.).
*   **Banco de Dados:** Alterações no modelo (como adicionar o e-mail) requerem recriação do arquivo `.db` em desenvolvimento (apagando dados) ou o uso de ferramentas de migração (não implementadas).

## 🤝 Contribuição

Contribuições são bem-vindas!

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork este repositório.
2. Crie uma branch com sua feature:

   ```bash
   git checkout -b minha-feature
   ```

3. Commit suas alterações:

   ```bash
   git commit -m 'Adiciona minha feature'
   ```

4. Push para a branch:

   ```bash
   git push origin minha-feature
   ```

5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato:

- GitHub: [@Henry5618](https://github.com/Henry5618)
- Email: henryfcalle@gmail.com
