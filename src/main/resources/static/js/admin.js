
/* =====================================================
   ESTETICKELITE
   PAINEL ADMINISTRATIVO
   Integração com Spring Boot + Thymeleaf
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // ELEMENTOS DO PAINEL
    // =================================================

    const elementoTotalAgendados =
        document.getElementById("totalAgendados");

    const elementoTotalFeitos =
        document.getElementById("totalFeitos");

    const elementoTotalServicos =
        document.getElementById("totalServicos");

    const elementoTaxaConclusao =
        document.getElementById("taxaConclusao");

    const canvasStatus =
        document.getElementById("graficoStatus");

    const canvasServicos =
        document.getElementById("graficoServicos");

    let graficoStatus = null;
    let graficoServicos = null;

    // =================================================
    // CONVERTER TEXTO EM NÚMERO
    // =================================================

    function obterNumero(elemento) {
        if (!elemento) {
            return 0;
        }

        const numero = Number(
            elemento.textContent.replace("%", "").trim()
        );

        return Number.isFinite(numero) ? numero : 0;
    }

    // =================================================
    // LER OS DADOS JÁ RENDERIZADOS PELO THYMELEAF
    // =================================================

    function obterAgendamentosDaPagina() {
        return Array.from(
            document.querySelectorAll(
                "#listaAgendados article.item-agendamento"
            )
        );
    }

    function obterCodigoServico(agendamento) {
        const paragrafos = agendamento.querySelectorAll("p");

        for (const paragrafo of paragrafos) {
            const titulo = paragrafo.querySelector("strong");

            if (
                titulo &&
                titulo.textContent.trim().toLowerCase()
                    .includes("código do serviço")
            ) {
                const valor = paragrafo.querySelector("span");

                return valor
                    ? valor.textContent.trim()
                    : "Não informado";
            }
        }

        return "Não informado";
    }

    // =================================================
    // GRÁFICO DE STATUS
    // =================================================

    function criarGraficoStatus(totalAgendados, totalFeitos) {
        if (!canvasStatus || typeof Chart === "undefined") {
            return;
        }

        if (graficoStatus) {
            graficoStatus.destroy();
        }

        graficoStatus = new Chart(canvasStatus, {
            type: "doughnut",

            data: {
                labels: ["Agendados", "Serviços feitos"],

                datasets: [{
                    data: [totalAgendados, totalFeitos],

                    backgroundColor: [
                        "#d4af37",
                        "#555555"
                    ],

                    borderColor: [
                        "#111111",
                        "#111111"
                    ],

                    borderWidth: 2
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom",

                        labels: {
                            color: "#ffffff"
                        }
                    }
                }
            }
        });
    }

    // =================================================
    // GRÁFICO POR CÓDIGO DE SERVIÇO
    // =================================================

    function criarGraficoServicos(agendamentos) {
        if (!canvasServicos || typeof Chart === "undefined") {
            return;
        }

        const quantidadePorServico = {};

        agendamentos.forEach(function (agendamento) {
            const codigo = obterCodigoServico(agendamento);

            quantidadePorServico[codigo] =
                (quantidadePorServico[codigo] || 0) + 1;
        });

        const codigos = Object.keys(quantidadePorServico);

        const labels = codigos.length
            ? codigos
            : ["Sem dados"];

        const valores = codigos.length
            ? codigos.map(codigo => quantidadePorServico[codigo])
            : [0];

        if (graficoServicos) {
            graficoServicos.destroy();
        }

        graficoServicos = new Chart(canvasServicos, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Quantidade de agendamentos",
                    data: valores,
                    backgroundColor: "#d4af37",
                    borderRadius: 6
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    x: {
                        ticks: {
                            color: "#cccccc"
                        },

                        grid: {
                            color: "#292929"
                        }
                    },

                    y: {
                        beginAtZero: true,

                        ticks: {
                            color: "#cccccc",
                            precision: 0
                        },

                        grid: {
                            color: "#292929"
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

    // =================================================
    // INICIALIZAR PAINEL
    // =================================================

    function inicializarPainel() {
        const totalAgendados =
            obterNumero(elementoTotalAgendados);

        const totalFeitos =
            obterNumero(elementoTotalFeitos);

        // Os indicadores são fornecidos pelo Controller.
        // Este script não altera os valores do banco.

        if (elementoTotalServicos) {
            console.debug(
                "Total de serviços:",
                obterNumero(elementoTotalServicos)
            );
        }

        if (elementoTaxaConclusao) {
            console.debug(
                "Taxa de conclusão:",
                elementoTaxaConclusao.textContent.trim()
            );
        }

        const agendamentos = obterAgendamentosDaPagina();

        criarGraficoStatus(totalAgendados, totalFeitos);
        criarGraficoServicos(agendamentos);
    }

    inicializarPainel();
});
