
// ============================
// EstetickElite - script.js
// Dados de agendamentos (localStorage) + lógica do painel admin
// ============================

document.addEventListener("DOMContentLoaded", function () {



        if (sessionStorage.getItem("adminLogado") !== "true") {
        window.location.replace("./login-admin.html");
    }


    // PROTEÇÃO ADMINISTRATIVA //



    if (
        sessionStorage.getItem("adminLogado")
        !== "true"
    ) {

        window.location.href =
            "./login-admin.html";

    }


    const AGENDAMENTOS_KEY = "esteticelite_agendamentos";

    // ---------- Dados ----------

    function getAgendamentos() {
        try {
            const dados = localStorage.getItem(AGENDAMENTOS_KEY);
            return dados ? JSON.parse(dados) : [];
        } catch (erro) {
            console.error("Erro ao ler agendamentos:", erro);
            return [];
        }
    }

    function salvarAgendamentos(lista) {
        localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(lista));
    }

    function adicionarAgendamento(agendamento) {
        const lista = getAgendamentos();
        lista.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            status: "agendado",
            criadoEm: new Date().toISOString(),
            ...agendamento
        });
        salvarAgendamentos(lista);
    }

    function marcarComoFeito(id) {
        const lista = getAgendamentos();
        const item = lista.find((a) => a.id === id);
        if (item) {
            item.status = "feito";
            item.concluidoEm = new Date().toISOString();
            salvarAgendamentos(lista);
        }
        if (document.getElementById("totalAgendados")) {
            renderPainelAdmin();
        }
    }

    function excluirAgendamento(id) {
        const lista = getAgendamentos().filter((a) => a.id !== id);
        salvarAgendamentos(lista);
        if (document.getElementById("totalAgendados")) {
            renderPainelAdmin();
        }
    }

    // ---------- Formulário de agendamento (agendamento.html) ----------

    function initFormAgendamento() {
        const form = document.getElementById("formAgendamento");
        if (!form) return;

        form.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nome = document.getElementById("nomeCliente").value.trim();
            const telefone = document.getElementById("telefoneCliente").value.trim();
            const servico = document.getElementById("servicoEscolhido").value;
            const data = document.getElementById("dataAgendamento").value;
            const hora = document.getElementById("horaAgendamento").value;

            if (!nome || !telefone || !servico || !data || !hora) {
                alert("Preencha todos os campos para agendar.");
                return;
            }

            adicionarAgendamento({ nome, telefone, servico, data, hora });

            form.reset();

            const confirmacao = document.getElementById("confirmacaoAgendamento");
            if (confirmacao) {
                confirmacao.classList.remove("d-none");
            } else {
                alert("Agendamento realizado com sucesso!");
            }
        });
    }

    // ---------- Painel administrativo (admin.html) ----------

    let graficoStatusChart = null;
    let graficoServicosChart = null;

    function renderPainelAdmin() {
        const lista = getAgendamentos();

        const agendados = lista.filter((a) => a.status === "agendado");
        const feitos = lista.filter((a) => a.status === "feito");

        // Estatísticas
        document.getElementById("totalAgendados").textContent = agendados.length;
        document.getElementById("totalFeitos").textContent = feitos.length;
        document.getElementById("totalServicos").textContent = lista.length;

        const taxa = lista.length
            ? Math.round((feitos.length / lista.length) * 100)
            : 0;
        document.getElementById("taxaConclusao").textContent = taxa + "%";

        document.getElementById("contadorAgendados").textContent = agendados.length;
        document.getElementById("contadorFeitos").textContent = feitos.length;

        // Listas
        renderListaAgendamentos("listaAgendados", agendados, true);
        renderListaAgendamentos("listaFeitos", feitos, false);

        // Gráficos
        renderGraficoStatus(agendados.length, feitos.length);
        renderGraficoServicos(lista);
    }

    function renderListaAgendamentos(idContainer, itens, mostrarAcaoConcluir) {
        const container = document.getElementById(idContainer);
        if (!container) return;

        if (itens.length === 0) {
            container.innerHTML = '<p class="sem-itens">Nenhum item por aqui ainda.</p>';
            return;
        }

        container.innerHTML = itens
            .slice()
            .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
            .map((item) => `
            <div class="item-agendamento" data-id="${item.id}">
                <div class="item-info">
                    <strong>${escapeHtml(item.nome)}</strong>
                    <span>${escapeHtml(item.servico)}</span>
                    <span>${formatarData(item.data)} às ${item.hora}</span>
                    <span>${escapeHtml(item.telefone)}</span>
                </div>
                <div class="item-acoes">
                    ${mostrarAcaoConcluir
                    ? `<button class="btn-concluir" onclick="marcarComoFeito('${item.id}')">Concluir</button>`
                    : ""}
                    <button class="btn-excluir" onclick="excluirAgendamento('${item.id}')">Excluir</button>
                </div>
            </div>
        `)
            .join("");
    }

    function renderGraficoStatus(totalAgendados, totalFeitos) {
        const canvas = document.getElementById("graficoStatus");
        if (!canvas) return;

        if (graficoStatusChart) graficoStatusChart.destroy();

        graficoStatusChart = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: ["Agendados", "Feitos"],
                datasets: [{
                    data: [totalAgendados, totalFeitos],
                    backgroundColor: ["#f0a5c4", "#7c3f61"]
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } }
            }
        });
    }

    function renderGraficoServicos(lista) {
        const canvas = document.getElementById("graficoServicos");
        if (!canvas) return;

        const contagem = {};
        lista.forEach((item) => {
            contagem[item.servico] = (contagem[item.servico] || 0) + 1;
        });

        const labels = Object.keys(contagem);
        const valores = Object.values(contagem);

        if (graficoServicosChart) graficoServicosChart.destroy();

        graficoServicosChart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: labels.length ? labels : ["Sem dados"],
                datasets: [{
                    label: "Agendamentos",
                    data: valores.length ? valores : [0],
                    backgroundColor: "#c65d8a"
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    // ---------- Utilitários ----------

    function escapeHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto ?? "";
        return div.innerHTML;
    }

    function formatarData(dataISO) {
        if (!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // ---------- Inicialização ----------

    document.addEventListener("DOMContentLoaded", function () {
        initFormAgendamento();

        if (document.getElementById("totalAgendados")) {
            renderPainelAdmin();
        }
    });
    // =====================================================
    // PROTEÇÃO DO PAINEL
    // =====================================================

    if (sessionStorage.getItem("adminLogado") !== "true") {

        window.location.href = "./login-admin.html";

        return;
    }

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const listaAgendados =
        document.getElementById("listaAgendados");

    const listaFeitos =
        document.getElementById("listaFeitos");

    const totalAgendados =
        document.getElementById("totalAgendados");

    const totalFeitos =
        document.getElementById("totalFeitos");

    const totalServicos =
        document.getElementById("totalServicos");

    const taxaConclusao =
        document.getElementById("taxaConclusao");

    const contadorAgendados =
        document.getElementById("contadorAgendados");

    const contadorFeitos =
        document.getElementById("contadorFeitos");

    // =====================================================
    // PEGAR AGENDAMENTOS
    // =====================================================

    function pegarAgendamentos() {

        try {

            const dados =
                localStorage.getItem(
                    "agendamentosEstetickElite"
                );

            if (!dados) {
                return [];
            }

            const agendamentos =
                JSON.parse(dados);

            if (!Array.isArray(agendamentos)) {
                return [];
            }

            return agendamentos;

        } catch (erro) {

            console.error(
                "Erro ao carregar agendamentos:",
                erro
            );

            return [];
        }
    }

    // =====================================================
    // SALVAR
    // =====================================================

    function salvarAgendamentos(agendamentos) {

        localStorage.setItem(
            "agendamentosEstetickElite",
            JSON.stringify(agendamentos)
        );
    }

    // =====================================================
    // FORMATAR DATA
    // =====================================================

    function formatarData(data) {

        if (!data) {
            return "Não informada";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }

    // =====================================================
    // PROTEGER TEXTO
    // =====================================================

    function escaparHTML(texto) {

        const elemento =
            document.createElement("div");

        elemento.textContent =
            texto || "";

        return elemento.innerHTML;
    }

    // =====================================================
    // GRÁFICOS
    // =====================================================

    let graficoStatus = null;
    let graficoServicos = null;

    // =====================================================
    // CARREGAR AGENDAMENTOS
    // =====================================================

    function carregarAgendamentos() {

        const agendamentos =
            pegarAgendamentos();

        // Tudo que não estiver como "feito"
        // continua na lista de agendados
        const agendados =
            agendamentos.filter(function (item) {

                return item.status !== "feito";
            });

        const feitos =
            agendamentos.filter(function (item) {

                return item.status === "feito";
            });

        // =================================================
        // CONTADORES
        // =================================================

        if (totalAgendados) {
            totalAgendados.textContent =
                agendados.length;
        }

        if (totalFeitos) {
            totalFeitos.textContent =
                feitos.length;
        }

        if (totalServicos) {
            totalServicos.textContent =
                agendamentos.length;
        }

        if (contadorAgendados) {
            contadorAgendados.textContent =
                agendados.length;
        }

        if (contadorFeitos) {
            contadorFeitos.textContent =
                feitos.length;
        }

        // =================================================
        // TAXA
        // =================================================

        let taxa = 0;

        if (agendamentos.length > 0) {

            taxa = Math.round(
                (feitos.length /
                    agendamentos.length) * 100
            );
        }

        if (taxaConclusao) {

            taxaConclusao.textContent =
                taxa + "%";
        }

        // =================================================
        // LISTA DE AGENDADOS
        // =================================================

        if (listaAgendados) {

            listaAgendados.innerHTML = "";

            if (agendados.length === 0) {

                listaAgendados.innerHTML = `
                    <div class="agendamento-vazio">
                        Nenhum agendamento encontrado.
                    </div>
                `;
            }

            agendados.forEach(function (item) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(item.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(item.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(item.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(item.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(item.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(item.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                    item.observacoes ||
                    "Nenhuma observação"
                )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                    item.pagamento ||
                    "Não informado"
                )}
                        </p>

                    </div>

                    <button
                        type="button"
                        class="btn-concluir-agendamento"
                        data-id="${item.id}"
                    >
                        Marcar como concluído
                    </button>

                `;

                listaAgendados.appendChild(card);
            });
        }

        // =================================================
        // LISTA DE FEITOS
        // =================================================

        if (listaFeitos) {

            listaFeitos.innerHTML = "";

            if (feitos.length === 0) {

                listaFeitos.innerHTML = `
                    <div class="agendamento-vazio">
                        Nenhum serviço concluído.
                    </div>
                `;
            }

            feitos.forEach(function (item) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(item.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(item.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(item.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(item.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(item.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(item.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                    item.observacoes ||
                    "Nenhuma observação"
                )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                    item.pagamento ||
                    "Não informado"
                )}
                        </p>

                        <p class="status-concluido">
                            Serviço concluído
                        </p>

                    </div>

                `;

                listaFeitos.appendChild(card);
            });
        }

        // =================================================
        // GRÁFICOS
        // =================================================

        criarGraficos(
            agendados,
            feitos
        );
    }

    // =====================================================
    // MARCAR COMO CONCLUÍDO
    // =====================================================

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.classList.contains(
                    "btn-concluir-agendamento"
                )
            ) {
                return;
            }

            const id =
                Number(event.target.dataset.id);

            const agendamentos =
                pegarAgendamentos();

            const agendamento =
                agendamentos.find(function (item) {

                    return item.id === id;
                });

            if (!agendamento) {
                return;
            }

            agendamento.status =
                "feito";

            salvarAgendamentos(
                agendamentos
            );

            carregarAgendamentos();
        }
    );

    // =====================================================
    // GRÁFICOS
    // =====================================================

    function criarGraficos(
        agendados,
        feitos
    ) {

        if (typeof Chart === "undefined") {
            return;
        }

        const canvasStatus =
            document.getElementById(
                "graficoStatus"
            );

        const canvasServicos =
            document.getElementById(
                "graficoServicos"
            );

        // =================================================
        // STATUS
        // =================================================

        if (canvasStatus) {

            if (graficoStatus) {
                graficoStatus.destroy();
            }

            graficoStatus =
                new Chart(
                    canvasStatus,
                    {
                        type: "doughnut",

                        data: {

                            labels: [
                                "Agendados",
                                "Concluídos"
                            ],

                            datasets: [
                                {
                                    data: [
                                        agendados.length,
                                        feitos.length
                                    ],

                                    backgroundColor: [
                                        "#d4af37",
                                        "#555555"
                                    ],

                                    borderWidth: 0
                                }
                            ]
                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    labels: {
                                        color: "#ffffff"
                                    }
                                }
                            }
                        }
                    }
                );
        }

        // =================================================
        // SERVIÇOS
        // =================================================

        if (canvasServicos) {

            if (graficoServicos) {
                graficoServicos.destroy();
            }

            const todos =
                agendados.concat(feitos);

            const quantidade = {};

            todos.forEach(function (item) {

                const servico =
                    item.servico ||
                    "Não informado";

                if (!quantidade[servico]) {
                    quantidade[servico] = 0;
                }

                quantidade[servico]++;
            });

            graficoServicos =
                new Chart(
                    canvasServicos,
                    {
                        type: "bar",

                        data: {

                            labels:
                                Object.keys(
                                    quantidade
                                ),

                            datasets: [
                                {
                                    label:
                                        "Agendamentos",

                                    data:
                                        Object.values(
                                            quantidade
                                        ),

                                    backgroundColor:
                                        "#d4af37",

                                    borderRadius: 6
                                }
                            ]
                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            scales: {

                                x: {

                                    ticks: {
                                        color:
                                            "#cccccc"
                                    },

                                    grid: {
                                        color:
                                            "#292929"
                                    }
                                },

                                y: {

                                    beginAtZero: true,

                                    ticks: {
                                        color:
                                            "#cccccc",
                                        precision: 0
                                    },

                                    grid: {
                                        color:
                                            "#292929"
                                    }
                                }
                            },

                            plugins: {

                                legend: {
                                    display: false
                                }
                            }
                        }
                    }
                );
        }
    }

    // =====================================================
    // INICIAR
    // =====================================================

    carregarAgendamentos();

});

