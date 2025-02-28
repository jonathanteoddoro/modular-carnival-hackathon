# Documentação Técnica – Pill Chain

Este documento visa detalhar os aspectos técnicos do projeto Pill Chain, uma solução integrada para o controle e rastreabilidade de medicamentos controlados utilizando blockchain, aplicações web e mobile – e, futuramente, técnicas de machine learning para análise de dados e otimização de processos.

A estrutura desta documentação está dividida em três grandes áreas:

1. **Desenvolvimento de Sistemas**  
   Nesta seção serão descritas as stacks e tecnologias empregadas para o desenvolvimento do aplicativo (web e mobile), os principais fluxos de navegação e as integrações de API.

2. **Blockchain**  
   Aqui serão abordadas as características e funcionalidades dos smart contracts que compõem o DApp, com foco na tokenização dos medicamentos, emissão de prescrições e validação de vendas.

3. **Machine Learning (a ser integrado)**  
   Esta seção será expandida futuramente para incluir os modelos e algoritmos de machine learning que apoiarão a análise e a automação dos processos.

---

## 1. Desenvolvimento de Sistemas

### 1.1. Tecnologias e Stacks

- **Web:**  
  - Framework: [React](https://reactjs.org/) para a construção da interface web responsiva.  
  - Comunicação com a API: Utilização de HTTP REST para a interação com o backend desenvolvido em FastAPI.  
  - Integração com carteiras digitais: Suporte à MetaMask para interação com a blockchain.

- **Mobile/App:**  
  - Framework: [React Native](https://reactnative.dev/) para desenvolvimento de aplicações móveis com experiência nativa.  
  - Integração com APIs: Comunicação direta com o backend para operações de consulta e transações.

### 1.2. Funcionalidades do Sistema

- **Interface do Fabricante:**  
  - Permite que o fabricante realize o minting de tokens representativos dos medicamentos diretamente na carteira da farmácia adquirente.
  
- **Interface do Doutor:**  
  - Permite que médicos emitam prescrições digitais para uma wallet específica de um paciente, garantindo a autenticidade e rastreabilidade.

- **Interface da Farmácia:**  
  - Permite que as farmácias consultem os tokens de medicamentos, realizem a venda ao paciente e acionem a validação da prescrição.

- **Páginas de Consulta:**  
  1. **Consulta por ID do Medicamento:**  
     - Permite a digitação do ID do token (remédio) para visualizar informações detalhadas, incluindo status, batch e validade.
  2. **Consulta por Wallet da Farmácia:**  
     - Permite visualizar todos os medicamentos (tokens) associados à carteira da farmácia, com detalhes de cada token.

---

## 2. Blockchain

A camada de blockchain do Pill Chain utiliza smart contracts para garantir a integridade, a imutabilidade e a transparência das operações relacionadas à tokenização dos medicamentos, emissão de prescrições e validação de vendas. A seguir, detalhamos o smart contract responsável por gerenciar essas operações.

Considerando que a Pill Chain foi desenvolvido para atender a três fluxos principais:
- **Fabricante:** Responsável por mintar (criar) os tokens que representam os medicamentos e enviá-los diretamente para a carteira da farmácia que adquiri-los.
- **Doutor:** Permite que médicos emitam prescrições digitais, vinculando um medicamento específico à wallet de um paciente.
- **Farmácia:** Valida e processa a venda dos medicamentos, realizando a transferência dos tokens somente quando há uma prescrição válida.

Adicionalmente, o sistema disponibiliza duas páginas de consulta: uma para buscar informações detalhadas a partir do ID do medicamento e outra para visualizar, por carteira, todos os medicamentos atualmente possuídos por uma farmácia.

### Características do Sistema Blockchain

#### Registro e Rastreamento Imutável

- **Tokenização dos Medicamentos:** Cada medicamento controlado é representado por um token não fungível (NFT), que encapsula informações como o nome do remédio, número do lote e data de expiração. Este registro único permite rastrear o ciclo de vida do medicamento desde a sua fabricação até a dispensação final.
- **Eventos de Registro:** Sempre que um medicamento é mintado ou vendido, o contrato emite eventos que registram a operação. Isso possibilita a criação de dashboards e mecanismos de auditoria que monitoram a integridade dos dados.

#### Controle de Acesso e Validação

- **Roles e Permissões:** O contrato utiliza um sistema de controle de acesso baseado em roles, garantindo que apenas entidades autorizadas possam executar ações críticas:
  - **MANUFACTURER_ROLE:** Concede permissão para fabricantes mintarem novos tokens.
  - **DOCTOR_ROLE:** Permite que médicos emitam prescrições para pacientes.
  - **PHARMACY_ROLE:** Autoriza farmácias a venderem os medicamentos e validarem as prescrições.
- **Validação de Prescrições:** Antes que um medicamento seja vendido, a farmácia deve validar a existência de uma prescrição válida emitida por um médico para o paciente. Se a prescrição corresponder ao nome do medicamento, o token é transferido para o paciente e a prescrição é invalidada, evitando reutilizações.

#### Fluxo de Transação

1. **Minting pelo Fabricante:**  
   O fabricante chama a função de *batch minting*, especificando o nome do medicamento, lote, data de expiração, a wallet da farmácia destinatária e a quantidade de tokens a serem criados. Cada token é então emitido com um identificador único e registrado na blockchain.
   
2. **Emissão de Prescrição pelo Médico:**  
   Um médico autorizado pode emitir uma prescrição digital para um paciente. Essa operação registra, na blockchain, a intenção de que determinado medicamento seja administrado àquele paciente, vinculando o nome do remédio à wallet do paciente.
   
3. **Validação e Venda pela Farmácia:**  
   Ao vender o medicamento, a farmácia consulta a prescrição associada ao paciente e, se a validação for bem-sucedida, transfere o token representativo do medicamento para o paciente. Este processo garante que apenas pacientes com prescrições válidas recebam os medicamentos.

4. **Consultas e Auditoria:**  
   - **Consulta por ID do Medicamento:** Permite a qualquer usuário verificar os detalhes do token, incluindo informações do lote, validade e status (vendido ou não).
   - **Consulta por Wallet da Farmácia:** Exibe o inventário de medicamentos vinculados à carteira de uma farmácia, facilitando a gestão e auditoria do estoque.

### Smart Contract: MedicineTracker

A seguir, apresenta-se o código do smart contract responsável por implementar os mecanismos descritos:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MedicineTracker is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _medicineIds;

    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant PHARMACY_ROLE = keccak256("PHARMACY_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    struct Medicine {
        string name;
        string batchNumber;
        uint256 expirationDate;
        bool isSold;
    }

    struct Prescription {
        address patient;
        string medicineName;
        bool isValid;
    }

    mapping(uint256 => Medicine) public medicines;

    mapping(address => Prescription) public prescriptions;

    event MedicineMinted(uint256 indexed tokenId, string name, string batchNumber, address indexed manufacturer, address indexed pharmacy);
    event PrescriptionIssued(string medicineName, address indexed doctor, address indexed patient);
    event MedicineSold(uint256 indexed tokenId, address indexed pharmacy, address indexed patient);

    constructor() ERC721("MedicineTracker", "MEDNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function batchMintMedicine(
        string memory _name,
        string memory _batchNumber,
        uint256 _expirationDate,
        address _pharmacy,
        uint256 _quantity
    ) external onlyRole(MANUFACTURER_ROLE) {
        require(_pharmacy != address(0), "Endereco de farmacia invalido.");
        require(hasRole(PHARMACY_ROLE, _pharmacy), "O destinatario nao possui a role de farmacia.");
        require(_quantity > 0, "Quantidade deve ser maior que zero.");

        for (uint256 i = 0; i < _quantity; i++) {
            _medicineIds.increment();
            uint256 newTokenId = _medicineIds.current();

            _safeMint(_pharmacy, newTokenId);

            medicines[newTokenId] = Medicine({
                name: _name,
                batchNumber: _batchNumber,
                expirationDate: _expirationDate,
                isSold: false
            });

            emit MedicineMinted(newTokenId, _name, _batchNumber, msg.sender, _pharmacy);
        }
    }

    function issuePrescription(string memory _medicineName, address _patient) external onlyRole(DOCTOR_ROLE) {
        require(_patient != address(0), "Endereco do paciente invalido.");

        prescriptions[_patient] = Prescription({
            patient: _patient,
            medicineName: _medicineName,
            isValid: true
        });

        emit PrescriptionIssued(_medicineName, msg.sender, _patient);
    }

    function sellMedicine(uint256 _tokenId, address _patient) external onlyRole(PHARMACY_ROLE) {
        require(ownerOf(_tokenId) == msg.sender, "A farmacia nao e proprietaria deste medicamento.");
        require(!medicines[_tokenId].isSold, "Medicamento ja foi vendido.");

        Prescription storage presc = prescriptions[_patient];
        require(presc.isValid, "Nenhuma prescricao valida encontrada.");
        require(keccak256(bytes(presc.medicineName)) == keccak256(bytes(medicines[_tokenId].name)), "Prescricao nao corresponde ao medicamento.");

        presc.isValid = false;

        _transfer(msg.sender, _patient, _tokenId);
        medicines[_tokenId].isSold = true;

        emit MedicineSold(_tokenId, msg.sender, _patient);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```
### Integração com MetaMask e Redes de Teste
Para facilitar a interação dos usuários com a blockchain, o Pill Chain utiliza a MetaMask como carteira digital, que atua como um gateway para a rede. A escolha de usar a tecnologia da Scroll foi determinante para o sucesso do projeto. Se não fosse pela excelência da rede da Scroll, que oferece alta performance e segurança, o projeto nem seria viável. Para visualizar mais informações sobre o contrato, consulte [este endereço](https://sepolia.scrollscan.com/address/0x25b594824a71a093beaCC5Cc786281d4441912e5).

A Scroll não só permite um deployment ágil dos smart contracts na rede de teste, mas também garante que as transações sejam realizadas com baixa latência e custos reduzidos. Essa integração robusta possibilita que fabricantes, médicos e farmácias autentiquem suas transações e interajam com os smart contracts diretamente de seus navegadores, simplificando significativamente a execução de operações críticas sem que seja necessário um profundo conhecimento técnico sobre blockchain.

### 2.2. Fluxos de Interação das Páginas do DApp

- **Página do Fabricante:**  
  - Através desta interface, o fabricante acessa o módulo de minting e gera tokens para os medicamentos, direcionando-os à carteira de uma farmácia, conforme os parâmetros informados.
  
- **Página do Doutor:**  
  - O médico utiliza uma interface dedicada para emitir prescrições digitais. Ao selecionar o medicamento e inserir a wallet do paciente, a função `issuePrescription` é acionada, registrando a prescrição na blockchain.

- **Página da Farmácia (Venda e Consulta):**  
  - Ao tentar vender um medicamento, a farmácia acessa a função `sellMedicine` para validar a prescrição do paciente e efetuar a transferência do token.
  - **Consulta por ID do Medicamento:**  
    Permite que qualquer usuário (ou parte interessada) insira o ID de um medicamento e obtenha informações detalhadas do token, como nome, lote, data de expiração e status de venda.
  - **Consulta por Wallet da Farmácia:**  
    Exibe a lista de todos os medicamentos que a farmácia possui, permitindo um acompanhamento do inventário e a verificação dos históricos de transação.

---

## 3. Machine Learning

Nesta seção, o foco é a integração e aplicação de modelos de machine learning para identificar possíveis fluxos anormais entre compras e vendas. Enquanto o blockchain garante rastreabilidade e imutabilidade dos registros, os algoritmos de machine learning atuam na outra ponta, observando comportamentos atípicos durante a inserção dos dados.

### Utilização de Dados Sintéticos

Devido à escassez e à sensibilidade dos dados reais, o projeto adota técnicas de geração de dados sintéticos para complementar os datasets de treinamento. Essa abordagem permite:
- **Criação de cenários realistas:** Testar a robustez dos modelos em condições que simulam situações reais.
- **Ampliação do volume de dados:** Aumentar a base de dados sem comprometer a segurança das informações sensíveis.
- **Simulação de padrões variados:** Replicar diversos comportamentos atípicos que podem ocorrer em transações reais.

Os dados sintéticos são gerados por meio de algoritmos baseados em simulação estatística e técnicas como SMOTE, garantindo que a distribuição dos atributos se aproxime da realidade. Dessa forma, modelos como o RandomForestClassifier podem ser treinados e validados de maneira eficaz, aumentando a capacidade do sistema em detectar fraudes e anomalias.

### Modelo Utilizado

Optamos pelo modelo RandomForestClassifier devido à sua:
- **Capacidade de lidar com dados não linearmente separáveis.**
- **Interpretabilidade:** Permite análise da importância dos recursos utilizados.
- **Robustez contra overfitting:** Combina múltiplas árvores para obter melhores resultados.
- **Adaptabilidade:** Funciona bem mesmo com a complementação de dados sintéticos.

Além disso, o modelo passou por um rigoroso processo de feature engineering, que envolveu a seleção e transformação das variáveis mais relevantes para aprimorar seu desempenho. Esse modelo foi previamente treinado e armazenado em um arquivo no formato .pkl, o que possibilita sua rápida implantação em produção, dispensando a necessidade de re-treinamento a cada nova operação.

A aplicação conjunta dessas abordagens permite identificar fluxos anormais entre as operações de compra e venda, reforçando a segurança e a confiabilidade do sistema ao detectar comportamentos estranhos na inserção dos dados.

## Considerações Finais

Esta documentação técnica oferece uma visão abrangente do projeto Pill Chain, detalhando os aspectos de desenvolvimento de sistemas e as implementações blockchain que garantem a integridade e a transparência do processo de controle de medicamentos controlados. A abordagem modular adotada permite a evolução do sistema, com futuras integrações de técnicas de machine learning para potencializar a análise e a automação dos processos.

Para quaisquer dúvidas ou para contribuir com melhorias, consulte a equipe de desenvolvimento ou acesse os repositórios de código relacionados ao projeto.

---