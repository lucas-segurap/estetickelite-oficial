# 🚗 EstetickElite

### Sistema Web de Gerenciamento para Estética Automotiva

![Java](https://img.shields.io/badge/Java-Spring%20Boot-orange)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![HTML5](https://img.shields.io/badge/Frontend-HTML5-orange)
![CSS3](https://img.shields.io/badge/Frontend-CSS3-blue)
![Bootstrap](https://img.shields.io/badge/Framework-Bootstrap%205-purple)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)

---

## 📌 Sobre o projeto

O **EstetickElite** é um sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC), com o objetivo de modernizar e facilitar o gerenciamento de uma empresa de estética automotiva.

A aplicação busca oferecer uma solução tecnológica para organizar os processos administrativos e o atendimento aos clientes, permitindo o gerenciamento de cadastros, veículos, serviços e agendamentos.

O projeto foi desenvolvido utilizando Java com Spring Boot, integração com banco de dados MySQL e interface web construída com Thymeleaf, HTML, CSS e Bootstrap.

## 🎯 Objetivo geral

Desenvolver um sistema web capaz de auxiliar na administração de uma empresa de estética automotiva, proporcionando maior organização, praticidade e eficiência nos processos de atendimento e gerenciamento.

## ⚙️ Funcionalidades

### 👤 Área do cliente
- Cadastro de clientes.
- Login e autenticação.
- Cadastro e gerenciamento de veículos.
- Visualização dos serviços disponíveis.
- Realização de agendamentos.
- Seleção de serviços.
- Escolha da forma de pagamento.

### 🛠️ Área administrativa
- Acesso administrativo.
- Painel de gerenciamento.
- Visualização dos agendamentos.
- Gerenciamento das informações dos clientes.
- Acompanhamento dos serviços agendados.
- Visualização de dados administrativos por meio de gráficos.

### 🚘 Serviços automotivos
- Lavagem técnica.
- Combos de estética automotiva.
- Serviços personalizados.
- Apresentação dos serviços e respectivos valores.

## 💻 Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| Java | Linguagem principal |
| Spring Boot | Desenvolvimento do backend |
| Spring MVC | Controle das requisições |
| Spring Data JPA | Persistência de dados |
| Hibernate | Mapeamento objeto-relacional |
| MySQL | Banco de dados |
| Thymeleaf | Integração entre Java e HTML |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização |
| Bootstrap 5 | Responsividade e componentes |
| JavaScript | Interatividade |
| Chart.js | Gráficos administrativos |
| Maven | Gerenciamento de dependências |

## 🎨 Identidade visual

O EstetickElite utiliza uma identidade visual baseada em preto e dourado, buscando transmitir elegância, sofisticação e profissionalismo.

**Paleta de cores:**

- Preto: `#080808`
- Preto secundário: `#111111`
- Preto dos cards: `#161616`
- Cinza: `#222222`
- Dourado: `#D4AF37`
- Dourado claro: `#F0D56A`
- Branco: `#FFFFFF`

## 🗄️ Banco de dados

O sistema utiliza o MySQL para armazenar e organizar as informações da aplicação.

Entre as principais entidades estão:

- Clientes
- Veículos
- Agendamentos
- Serviços

O relacionamento entre clientes e veículos permite que um cliente possua um ou mais veículos cadastrados, enquanto cada veículo está associado a um cliente.

## 📂 Estrutura do projeto

A aplicação segue o padrão MVC (Model-View-Controller), organizando as responsabilidades em diferentes camadas.

```text
estetickelite01/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/br/estetickelite/
│       │       ├── Controller/
│       │       ├── Model/
│       │       ├── Repository/
│       │       └── ...
│       │
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   ├── js/
│           │   └── imagens/
│           │
│           ├── templates/
│           │   ├── fragments/
│           │   ├── admin/
│           │   └── ...
│           │
│           └── application.properties/
│
├── pom.xml
└── README.md
```

*Observação: estrutura ilustrativa, podendo ser ajustada conforme a organização final do projeto.*

## 🚀 Como executar o projeto

### 1. Pré-requisitos

Antes de executar a aplicação, é necessário possuir:

- Java JDK compatível com a versão configurada no projeto.
- IntelliJ IDEA ou outra IDE Java.
- MySQL Server.
- Maven.

### 2. Clonar o repositório

```bash
git clone URL_DO_SEU_REPOSITORIO
```

### 3. Criar o banco de dados

No MySQL, crie o banco de dados:

```sql
CREATE DATABASE estetickelite;
```

### 4. Configurar a conexão

Configure o arquivo `application.properties` com os dados do seu banco de dados:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/estetickelite
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Utilize as configurações de conexão compatíveis com o ambiente do projeto.

### 5. Executar a aplicação

Pelo terminal, na pasta do projeto:

```bash
mvn spring-boot:run
```

Ou execute a classe principal diretamente pela IDE.

### 6. Acessar o sistema

Após iniciar a aplicação, acesse:

```text
http://localhost:80
```

*O endereço depende da porta configurada no arquivo application.properties.*

## 🔐 Segurança

O projeto contempla mecanismos de acesso às áreas de clientes e administração.

As credenciais do banco de dados devem ser mantidas fora do repositório público, evitando a exposição de informações sensíveis.

## 📈 Melhorias futuras

- Aprimoramento da segurança e autenticação.
- Integração com meios reais de pagamento.
- Envio automático de notificações sobre agendamentos.
- Histórico de serviços realizados por veículo.
- Relatórios administrativos mais completos.
- Melhorias na experiência do usuário.

## 🎓 Trabalho de Conclusão de Curso

Projeto desenvolvido para fins acadêmicos, como parte do Trabalho de Conclusão de Curso (TCC), com foco na aplicação prática dos conhecimentos adquiridos durante a formação técnica em desenvolvimento de sistemas.

## 👨‍💻 Desenvolvedor

**Lucas Segura Pereira**

Desenvolvimento de Sistemas

**Projeto:** EstetickElite

---

© 2026 EstetickElite. Todos os direitos reservados.
