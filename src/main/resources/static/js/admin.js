
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
