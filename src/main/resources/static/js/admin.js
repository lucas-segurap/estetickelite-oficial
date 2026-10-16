
/* =====================================================
   ESTETICKELITE
   PAINEL ADMINISTRATIVO
   JavaScript + Spring Boot + Thymeleaf
   Identidade visual: Preto + Dourado
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* 1. ELEMENTOS DO HTML */

    const listaAgendados = document.getElementById("listaAgendados");
    const contadorAgendados = document.getElementById("contadorAgendados");

    const graficoStatus = document.getElementById("graficoStatus");
    const graficoServicos = document.getElementById("graficoServicos");

    /* 2. AGENDAMENTOS RENDERIZADOS PELO THYMELEAF */

    const agendamentos = listaAgendados
        ? Array.from(
            listaAgendados.querySelectorAll("article.item-agendamento")
        )
        : [];

    if (contadorAgendados) {
        contadorAgendados.textContent = agendamentos.length;
    }

    /* 3. FUNÇÕES AUXILIARES */

    function obterCampo(agendamento, nomeCampo) {
        const campos = agendamento.querySelectorAll("p");

        for (const campo of campos) {
            const titulo = campo.querySelector("strong");

            if (!titulo) {
                continue;
            }

            const nome = titulo.textContent
                .replace(/:/g, "")
                .trim()
                .toLocaleLowerCase("pt-BR");

            if (nome !== nomeCampo.toLocaleLowerCase("pt-BR")) {
                continue;
            }

            const valor = campo.querySelector("span");

            return valor ? valor.textContent.trim() : "";
        }

        return "";
    }

    function contarValores(campo) {
        const contagem = {};

        agendamentos.forEach(function (agendamento) {
            let valor = obterCampo(agendamento, campo);

            if (!valor || valor === "Não informada") {
                valor = "Não informado";
            }

            contagem[valor] = (contagem[valor] || 0) + 1;
        });

        return contagem;
    }

    /* 4. CONFIGURAÇÃO VISUAL */

    const coresDouradas = [
        "#d4af37",
        "#f0d56a",
        "#b8962e",
        "#e0c36a",
        "#8f7625",
        "#f5e3a1"
    ];

    if (typeof Chart === "undefined") {
        console.warn("EstetickElite: Chart.js não foi carregado.");
        return;
    }

    Chart.defaults.color = "#cccccc";
    Chart.defaults.font.family = "Arial, sans-serif";

    function destruirGrafico(canvas) {
        if (!canvas) {
            return;
        }

        const existente = Chart.getChart(canvas);

        if (existente) {
            existente.destroy();
        }
    }

    /* 5. GRÁFICO DE AGENDAMENTOS POR DATA */

    if (graficoStatus) {
        destruirGrafico(graficoStatus);

        const dadosDatas = contarValores("Data");
        const entradas = Object.entries(dadosDatas).sort(function (a, b) {
            return a[0].localeCompare(b[0], "pt-BR");
        });

        new Chart(graficoStatus, {
            type: "doughnut",

            data: {
                labels: entradas.length
                    ? entradas.map(item => item[0])
                    : ["Sem agendamentos"],

                datasets: [{
                    label: "Agendamentos por data",

                    data: entradas.length
                        ? entradas.map(item => item[1])
                        : [1],

                    backgroundColor: entradas.length
                        ? entradas.map(
                            (_, indice) =>
                                coresDouradas[indice % coresDouradas.length]
                        )
                        : ["#333333"],

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
                                if (entradas.length === 0) {
                                    return "Nenhum agendamento";
                                }

                                return context.label + ": " +
                                    context.raw + " agendamento(s)";
                            }
                        }
                    }
                }
            }
        });
    }

    /* 6. GRÁFICO POR CÓDIGO DO SERVIÇO */

    if (graficoServicos) {
        destruirGrafico(graficoServicos);

        const dadosServicos = contarValores("Código do serviço");

        const entradas = Object.entries(dadosServicos).sort(
            (a, b) => b[1] - a[1]
        );

        new Chart(graficoServicos, {
            type: "bar",

            data: {
                labels: entradas.length
                    ? entradas.map(item => item[0])
                    : ["Sem dados"],

                datasets: [{
                    label: "Quantidade de agendamentos",

                    data: entradas.length
                        ? entradas.map(item => item[1])
                        : [0],

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
                                return context.raw + " agendamento(s)";
                            }
                        }
                    }
                }
            }
        });
    }

    /* 7. LOG DE VERIFICAÇÃO */

    console.info("EstetickElite: painel carregado.", {
        quantidadeAgendamentos: agendamentos.length
    });
});
