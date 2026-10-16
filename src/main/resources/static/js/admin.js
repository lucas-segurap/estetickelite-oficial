
/* =====================================================
   ESTETICKELITE
   PAINEL ADMINISTRATIVO
   JavaScript atualizado
   Identidade visual: Preto + Dourado
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       ELEMENTOS DO PAINEL
    ===================================================== */

    const totalAgendados = document.getElementById("totalAgendados");
    const totalFeitos = document.getElementById("totalFeitos");
    const totalServicos = document.getElementById("totalServicos");
    const taxaConclusao = document.getElementById("taxaConclusao");

    const listaAgendados = document.querySelectorAll(
        "#listaAgendados article.item-agendamento"
    );

    const graficoStatus = document.getElementById("graficoStatus");
    const graficoServicos = document.getElementById("graficoServicos");

    /* =====================================================
       FUNÇÕES AUXILIARES
    ===================================================== */

    function normalizarTexto(texto) {
        return (texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    }

    function obterTexto(elemento) {
        return elemento ? elemento.textContent.trim() : "";
    }

    function identificarStatus(agendamento) {
        const statusElemento = agendamento.querySelector(
            "[data-status], .status-agendamento, .status"
        );

        const statusData = statusElemento
            ? statusElemento.getAttribute("data-status")
            : "";

        const textoStatus = normalizarTexto(
            statusData || obterTexto(statusElemento)
        );

        if (
            textoStatus.includes("concluido") ||
            textoStatus.includes("finalizado") ||
            textoStatus.includes("realizado")
        ) {
            return "Concluído";
        }

        if (
            textoStatus.includes("cancelado")
        ) {
            return "Cancelado";
        }

        if (
            textoStatus.includes("andamento") ||
            textoStatus.includes("atendimento") ||
            textoStatus.includes("iniciado")
        ) {
            return "Em andamento";
        }

        if (
            textoStatus.includes("pendente") ||
            textoStatus.includes("aguardando") ||
            textoStatus.includes("agendado")
        ) {
            return "Pendente";
        }

        return "Outros";
    }

    function identificarServico(agendamento) {
        const servicoElemento = agendamento.querySelector(
            "[data-servico], .servico-agendamento, .codigo-servico"
        );

        if (servicoElemento) {
            const codigo = servicoElemento.getAttribute("data-servico");

            return (
                codigo ||
                obterTexto(servicoElemento) ||
                "Não informado"
            );
        }

        const texto = obterTexto(agendamento);

        const correspondencia = texto.match(
            /Código\s+do\s+serviço\s*:\s*([^\n\r]+)/i
        );

        return correspondencia
            ? correspondencia[1].trim()
            : "Não informado";
    }

    function atualizarTexto(elemento, valor) {
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    /* =====================================================
       CONTAGEM DOS AGENDAMENTOS
    ===================================================== */

    const quantidadeAgendamentos = listaAgendados.length;

    const contagemStatus = {
        "Pendente": 0,
        "Em andamento": 0,
        "Concluído": 0,
        "Cancelado": 0,
        "Outros": 0
    };

    const contagemServicos = {};

    listaAgendados.forEach(function (agendamento) {

        const status = identificarStatus(agendamento);
        const servico = identificarServico(agendamento);

        contagemStatus[status]++;

        contagemServicos[servico] =
            (contagemServicos[servico] || 0) + 1;
    });

    const quantidadeConcluidos = contagemStatus["Concluído"];

    const quantidadeServicos = Object.keys(contagemServicos)
        .filter(function (servico) {
            return servico !== "Não informado";
        })
        .length;

    const percentualConclusao = quantidadeAgendamentos > 0
        ? Math.round(
            (quantidadeConcluidos / quantidadeAgendamentos) * 100
        )
        : 0;

    /* =====================================================
       ATUALIZAÇÃO DOS INDICADORES
    ===================================================== */

    atualizarTexto(totalAgendados, quantidadeAgendamentos);

    atualizarTexto(totalFeitos, quantidadeConcluidos);

    atualizarTexto(totalServicos, quantidadeServicos);

    atualizarTexto(taxaConclusao, percentualConclusao + "%");

    /* =====================================================
       CONFIGURAÇÃO DOS GRÁFICOS
    ===================================================== */

    if (typeof Chart === "undefined") {
        console.warn(
            "EstetickElite: Chart.js não foi carregado."
        );
        return;
    }

    Chart.defaults.color = "#cccccc";
    Chart.defaults.font.family = "Arial, sans-serif";

    /* =====================================================
       GRÁFICO DE STATUS
    ===================================================== */

    if (graficoStatus) {

        const graficoExistente = Chart.getChart(graficoStatus);

        if (graficoExistente) {
            graficoExistente.destroy();
        }

        new Chart(graficoStatus, {

            type: "doughnut",

            data: {
                labels: [
                    "Pendente",
                    "Em andamento",
                    "Concluído",
                    "Cancelado",
                    "Outros"
                ],

                datasets: [{
                    label: "Agendamentos",

                    data: [
                        contagemStatus["Pendente"],
                        contagemStatus["Em andamento"],
                        contagemStatus["Concluído"],
                        contagemStatus["Cancelado"],
                        contagemStatus["Outros"]
                    ],

                    backgroundColor: [
                        "#d4af37",
                        "#e0a020",
                        "#4caf50",
                        "#e74c3c",
                        "#777777"
                    ],

                    borderColor: "#111111",
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom",

                        labels: {
                            color: "#cccccc",
                            padding: 15,
                            usePointStyle: true
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ": " +
                                    context.raw + " agendamento(s)";
                            }
                        }
                    }
                }
            }
        });
    }

    /* =====================================================
       GRÁFICO DE SERVIÇOS
    ===================================================== */

    if (graficoServicos) {

        const graficoExistente = Chart.getChart(graficoServicos);

        if (graficoExistente) {
            graficoExistente.destroy();
        }

        const servicosOrdenados = Object.entries(contagemServicos)
            .sort(function (a, b) {
                return b[1] - a[1];
            });

        new Chart(graficoServicos, {

            type: "bar",

            data: {
                labels: servicosOrdenados.map(function (item) {
                    return item[0];
                }),

                datasets: [{
                    label: "Quantidade de agendamentos",

                    data: servicosOrdenados.map(function (item) {
                        return item[1];
                    }),

                    backgroundColor: "#d4af37",
                    borderColor: "#f0d56a",
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                indexAxis: "y",

                scales: {
                    x: {
                        beginAtZero: true,

                        ticks: {
                            precision: 0,
                            color: "#cccccc"
                        },

                        grid: {
                            color: "rgba(255, 255, 255, 0.08)"
                        }
                    },

                    y: {
                        ticks: {
                            color: "#cccccc"
                        },

                        grid: {
                            display: false
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    console.info(
        "EstetickElite: painel administrativo carregado."
    );

});

/* =====================================================
   ESTETICKELITE
   PAINEL ADMINISTRATIVO
   JavaScript integrado ao Spring Boot + Thymeleaf
   Identidade visual: Preto + Dourado
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       1. ELEMENTOS DO HTML
    ===================================================== */

    const listaAgendados = document.getElementById("listaAgendados");
    const contadorAgendados = document.getElementById("contadorAgendados");

    const totalAgendados = document.getElementById("totalAgendados");
    const totalFeitos = document.getElementById("totalFeitos");
    const totalServicos = document.getElementById("totalServicos");
    const taxaConclusao = document.getElementById("taxaConclusao");

    const graficoStatus = document.getElementById("graficoStatus");
    const graficoServicos = document.getElementById("graficoServicos");

    /* =====================================================
       2. FUNÇÕES AUXILIARES
    ===================================================== */

    function obterAgendamentos() {
        if (!listaAgendados) {
            return [];
        }

        return Array.from(
            listaAgendados.querySelectorAll(
                "article.item-agendamento"
            )
        );
    }

    function obterTexto(elemento) {
        return elemento
            ? elemento.textContent.trim()
            : "";
    }

    function normalizarTexto(texto) {
        return (texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    }

    /*
     * Localiza um campo dentro do agendamento pelo
     * texto do elemento <strong> correspondente.
     */
    function obterCampo(agendamento, nomeCampo) {
        const campos = agendamento.querySelectorAll("p");

        for (const campo of campos) {
            const titulo = campo.querySelector("strong");

            if (
                titulo &&
                normalizarTexto(titulo.textContent)
                    .replace(/:$/, "") ===
                normalizarTexto(nomeCampo).replace(/:$/, "")
            ) {
                const valor = campo.querySelector("span");

                return obterTexto(valor);
            }
        }

        return "";
    }

    function contarPorCampo(agendamentos, campo) {
        const contagem = {};

        agendamentos.forEach(function (agendamento) {
            let valor = obterCampo(agendamento, campo);

            if (!valor || normalizarTexto(valor) === "nao informado") {
                valor = "Não informado";
            }

            contagem[valor] = (contagem[valor] || 0) + 1;
        });

        return contagem;
    }

    /* =====================================================
       3. ATUALIZAÇÃO DO CONTADOR DA LISTA
    ===================================================== */

    const agendamentos = obterAgendamentos();
    const quantidadeAgendamentos = agendamentos.length;

    if (contadorAgendados) {
        contadorAgendados.textContent = quantidadeAgendamentos;
    }

    /*
     * Os indicadores principais são calculados pelo
     * Spring Boot e renderizados pelo Thymeleaf.
     *
     * Não os sobrescrevemos com dados incompletos
     * obtidos apenas da lista visível no HTML.
     */

    /* =====================================================
       4. PREPARAÇÃO DOS DADOS DOS GRÁFICOS
    ===================================================== */

    const servicos = contarPorCampo(
        agendamentos,
        "Código do serviço"
    );

    const statusDisponiveis = {};

    /*
     * O HTML atual não contém um campo de status.
     * Se ele for adicionado posteriormente, o gráfico
     * poderá aproveitar os dados automaticamente.
     */

    agendamentos.forEach(function (agendamento) {
        const status = obterCampo(agendamento, "Status");

        if (status) {
            statusDisponiveis[status] =
                (statusDisponiveis[status] || 0) + 1;
        }
    });

    /* =====================================================
       5. CONFIGURAÇÃO GERAL DO CHART.JS
    ===================================================== */

    if (typeof Chart === "undefined") {
        console.warn(
            "EstetickElite: Chart.js não foi carregado."
        );
        return;
    }

    Chart.defaults.color = "#cccccc";
    Chart.defaults.font.family = "Arial, sans-serif";

    const coresDouradas = [
        "#d4af37",
        "#f0d56a",
        "#b8962e",
        "#e0c36a",
        "#8f7625",
        "#f5e3a1"
    ];

    /* =====================================================
       6. GRÁFICO DE RESUMO DOS AGENDAMENTOS
    ===================================================== */

    if (graficoStatus) {
        const existente = Chart.getChart(graficoStatus);

        if (existente) {
            existente.destroy();
        }

        const possuiStatus = Object.keys(statusDisponiveis).length > 0;

        const labelsStatus = possuiStatus
            ? Object.keys(statusDisponiveis)
            : ["Status não informado"];

        const valoresStatus = possuiStatus
            ? Object.values(statusDisponiveis)
            : [quantidadeAgendamentos];

        const coresStatus = possuiStatus
            ? labelsStatus.map(function (_, indice) {
                return coresDouradas[
                    indice % coresDouradas.length
                ];
            })
            : ["#777777"];

        new Chart(graficoStatus, {
            type: "doughnut",

            data: {
                labels: labelsStatus,

                datasets: [{
                    label: "Agendamentos",

                    data: valoresStatus,

                    backgroundColor: coresStatus,

                    borderColor: "#111111",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom",

                        labels: {
                            color: "#cccccc",
                            padding: 15,
                            usePointStyle: true
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ": " +
                                    context.raw + " agendamento(s)";
                            }
                        }
                    }
                }
            }
        });
    }

    /* =====================================================
       7. GRÁFICO DE SERVIÇOS CADASTRADOS
    ===================================================== */

    if (graficoServicos) {
        const existente = Chart.getChart(graficoServicos);

        if (existente) {
            existente.destroy();
        }

        const dadosServicos = Object.entries(servicos)
            .sort(function (a, b) {
                return b[1] - a[1];
            });

        new Chart(graficoServicos, {
            type: "bar",

            data: {
                labels: dadosServicos.map(function (item) {
                    return item[0];
                }),

                datasets: [{
                    label: "Quantidade de agendamentos",

                    data: dadosServicos.map(function (item) {
                        return item[1];
                    }),

                    backgroundColor: "#d4af37",
                    borderColor: "#f0d56a",
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                indexAxis: "y",

                scales: {
                    x: {
                        beginAtZero: true,

                        ticks: {
                            precision: 0,
                            color: "#cccccc"
                        },

                        grid: {
                            color: "rgba(255, 255, 255, 0.08)"
                        }
                    },

                    y: {
                        ticks: {
                            color: "#cccccc"
                        },

                        grid: {
                            display: false
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.raw +
                                    " agendamento(s)";
                            }
                        }
                    }
                }
            }
        });
    }

    /* =====================================================
       8. FINALIZAÇÃO
    ===================================================== */

    console.info(
        "EstetickElite: admin.js carregado com sucesso.",
        {
            agendamentos: quantidadeAgendamentos,
            servicos: Object.keys(servicos).length
        }
    );

});
