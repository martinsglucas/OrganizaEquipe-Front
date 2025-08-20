## **OrganizaEquipe - Gerenciamento de Equipes e Escalas**

### **Propósito** 

O OrganizaEquipe é uma aplicação web focada em simplificar o gerenciamento de equipes e a criação de escalas de trabalho ou eventos.

A plataforma permite que usuários criem ou ingressem em organizações e equipes, gerenciem membros e funções, e organizem escalas de forma intuitiva, considerando a disponibilidade de cada membro.

---

### **Funcionalidades Principais**

* **Autenticação de Usuário:** O sistema conta com um fluxo de autenticação completo, permitindo que novos usuários se cadastrem e que usuários existentes façam login.
* **Gerenciamento de Organizações:**
    * Os usuários podem criar ou entrar em organizações existentes por meio de um código de acesso.
    * É possível gerenciar os administradores e membros da organização, além de enviar convites para novos membros.
* **Gerenciamento de Equipes:**
    * Similar às organizações, os usuários podem criar ou ingressar em equipes.
    * As equipes possuem gerenciamento de membros, administradores e funções específicas (cargos).
* **Gerenciamento de Escalas:**
    * Os administradores de uma equipe podem criar, editar e excluir escalas para a equipe.
    * As escalas são criadas com base em um título, data, hora e os participantes designados.
    * Os membros das escalas podem confirmar ou cancelar sua participação.
* **Controle de Indisponibilidade:** Os usuários podem registrar datas e motivos de sua indisponibilidade, o que é útil para a criação de escalas.
* **Notificações e Solicitações:** O sistema lida com convites e solicitações de ingresso em organizações e equipes, permitindo que administradores aceitem ou recusem pedidos de novos membros.

---

### **Estrutura e Tecnologias**

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

* **Frontend:**
    * React.js
    * HTML, CSS Modules
    * React Router DOM para navegação
    * Axios para comunicação com a API
    * Bibliotecas de ícones (React Icons)
    * `react-toastify` para notificações
    * Context API para gerenciamento de estado
    * `dayjs` para manipulação de datas
* **Backend:**
    * API construída com Python Django, com a URL base `https://organizaequipe-api.onrender.com/api/`.

---

### **Como Executar o Projeto**

1.  **Pré-requisitos:** Certifique-se de ter o Node.js e o npm instalados em sua máquina.
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie a aplicação:**
    ```bash
    npm start
    ```
4.  A aplicação será executada em [http://localhost:3000](http://localhost:3000) por padrão.