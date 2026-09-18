
document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isInsidePaginas = currentPath.includes("/paginas/");
    const basePath = isInsidePaginas ? ".." : ".";

    const loadFragment = (containerId, fragmentPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`${basePath}/${fragmentPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar ${fragmentPath}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    };

    loadFragment("header-container", "fragments/header.html");
    loadFragment("footer-container", "fragments/footer.html");
});
var qrGerado = false;
var timerInterval = null;
var TEMPO_TOTAL = 5 * 60; // 5 minutos em segundos

function resetarEtapasPix() {
    document.getElementById('pix-confirmacao').style.display = 'block';
    document.getElementById('pix-qr-area').style.display = 'none';
    document.getElementById('pix-expirado').style.display = 'none';

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function iniciarContagemPix() {
    var segundosRestantes = TEMPO_TOTAL;
    var timerEl = document.getElementById('pix-timer');

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    atualizarTimer();

    timerInterval = setInterval(function () {
        segundosRestantes--;

        if (segundosRestantes <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            // Esconde o QR Code e mostra a mensagem de expirado
            document.getElementById('pix-qr-area').style.display = 'none';
            document.getElementById('pix-expirado').style.display = 'block';

            // Limpa o QR Code para que um novo seja gerado da próxima vez
            document.getElementById('qrcode-pix').innerHTML = '';
            qrGerado = false;
        } else {
            atualizarTimer();
        }
    }, 1000);

    function atualizarTimer() {
        var minutos = Math.floor(segundosRestantes / 60);
        var segundos = segundosRestantes % 60;
        timerEl.textContent = 'Expira em ' +
            String(minutos).padStart(2, '0') + ':' +
            String(segundos).padStart(2, '0');
    }
}

function gerarQrCodePix() {
    document.getElementById('pix-confirmacao').style.display = 'none';
    document.getElementById('pix-expirado').style.display = 'none';
    document.getElementById('pix-qr-area').style.display = 'block';

    if (!qrGerado) {
        new QRCode(document.getElementById('qrcode-pix'), {
            text: document.getElementById('pix-copia-cola-input').value,
            width: 180,
            height: 180,
            colorDark: '#1a1a1a',
            colorLight: '#ffffff'
        });
        qrGerado = true;
    }

    iniciarContagemPix();
}

// Alterna a exibição dos campos de cartão/pix conforme a forma de pagamento escolhida
document.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        var dadosCartao = document.getElementById('dados-cartao');
        var dadosPix = document.getElementById('dados-pix');

        if (this.value === 'credito' || this.value === 'debito') {
            dadosCartao.style.display = 'block';
            dadosPix.style.display = 'none';
        } else if (this.value === 'pix') {
            dadosCartao.style.display = 'none';
            dadosPix.style.display = 'block';
            resetarEtapasPix();
        }
    });
});

// Botão "Sim, é o Pix que eu vou pagar" -> gera QR Code e inicia contagem
document.getElementById('btn-confirmar-pix').addEventListener('click', function () {
    gerarQrCodePix();
});

// Botão "Gerar novo QR Code" após expiração
document.getElementById('btn-gerar-novo-pix').addEventListener('click', function () {
    gerarQrCodePix();
});

// Botão "Copiar" do código Pix copia e cola
document.getElementById('btn-copiar-pix').addEventListener('click', function () {
    var input = document.getElementById('pix-copia-cola-input');
    input.select();
    navigator.clipboard.writeText(input.value).then(function () {
        var btn = document.getElementById('btn-copiar-pix');
        var textoOriginal = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(function () {
            btn.textContent = textoOriginal;
        }, 1500);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isInsidePaginas = currentPath.includes("/paginas/");
    const basePath = isInsidePaginas ? ".." : ".";

    const loadFragment = (containerId, fragmentPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`${basePath}/${fragmentPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar ${fragmentPath}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    };

    loadFragment("header-container", "fragments/header.html");
    loadFragment("footer-container", "fragments/footer.html");
});



let graficoStatus;

let graficoServicos;


// ==========================================
// PEGAR AGENDAMENTOS
// ==========================================

function pegarAgendamentos() {

    return JSON.parse(
        localStorage.getItem("agendamentosEstetick")
    ) || [];

}


// ==========================================
// SALVAR AGENDAMENTOS
// ==========================================

function salvarAgendamentos(agendamentos) {

    localStorage.setItem(
        "agendamentosEstetick",
        JSON.stringify(agendamentos)
    );

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// CRIAR CARD
// ==========================================

function criarCard(agendamento, feito = false) {

    return `

                <div class="agendamento-card">

                    <div class="agendamento-topo">

                        <h3>
                            ${agendamento.nome}
                        </h3>

                        <span class="status">
                            ${feito ? "✓ CONCLUÍDO" : "● AGENDADO"}
                        </span>

                    </div>


                    <div class="informacoes">


                        <div class="informacao">

                            <small>
                                Veículo
                            </small>

                            <strong>
                                ${agendamento.veiculo}
                            </strong>

                        </div>


                        <div class="informacao">

                            <small>
                                Serviço
                            </small>

                            <strong>
                                ${agendamento.servico}
                            </strong>

                        </div>


                        <div class="informacao">

                            <small>
                                Data
                            </small>

                            <strong>
                                ${formatarData(agendamento.data)}
                            </strong>

                        </div>


                        <div class="informacao">

                            <small>
                                Horário
                            </small>

                            <strong>
                                ${agendamento.horario}
                            </strong>

                        </div>


                    </div>


                    <div class="observacao">

                        <strong>
                            Pagamento:
                        </strong>

                        ${agendamento.pagamento || "-"}

                        <br>

                        <strong>
                            Observações:
                        </strong>

                        ${agendamento.observacoes || "Nenhuma"}

                    </div>


                    ${!feito

            ?

            `

                        <div class="acoes">

                            <button
                                class="btn-feito"
                                onclick="marcarComoFeito(${agendamento.id})"
                            >
                                ✓ Marcar como feito
                            </button>

                            <button
                                class="btn-excluir"
                                onclick="excluirAgendamento(${agendamento.id})"
                            >
                                Excluir
                            </button>

                        </div>

                        `

            :

            `

                        <div class="acoes">

                            <button
                                class="btn-excluir"
                                onclick="excluirAgendamento(${agendamento.id})"
                            >
                                Excluir
                            </button>

                        </div>

                        `

        }

                </div>

            `;

}


// ==========================================
// ATUALIZAR PAINEL
// ==========================================

function atualizarPainel() {

    const agendamentos =
        pegarAgendamentos();


    const agendados =
        agendamentos.filter(
            item => item.status === "agendado"
        );


    const feitos =
        agendamentos.filter(
            item => item.status === "feito"
        );


    // CONTADORES

    document.getElementById("totalAgendados")
        .textContent = agendados.length;

    document.getElementById("totalFeitos")
        .textContent = feitos.length;

    document.getElementById("totalServicos")
        .textContent = agendamentos.length;

    document.getElementById("contadorAgendados")
        .textContent = agendados.length;

    document.getElementById("contadorFeitos")
        .textContent = feitos.length;


    let taxa = 0;

    if (agendamentos.length > 0) {

        taxa =
            Math.round(
                (feitos.length / agendamentos.length) * 100
            );

    }


    document.getElementById("taxaConclusao")
        .textContent = taxa + "%";


    // LISTA AGENDADOS

    const listaAgendados =
        document.getElementById("listaAgendados");


    if (agendados.length === 0) {

        listaAgendados.innerHTML = `

                    <div class="vazio">

                        Nenhum agendamento pendente no momento.

                    </div>

                `;

    } else {

        listaAgendados.innerHTML =
            agendados
                .map(item => criarCard(item))
                .join("");

    }


    // LISTA FEITOS

    const listaFeitos =
        document.getElementById("listaFeitos");


    if (feitos.length === 0) {

        listaFeitos.innerHTML = `

                    <div class="vazio">

                        Nenhum serviço foi concluído ainda.

                    </div>

                `;

    } else {

        listaFeitos.innerHTML =
            feitos
                .map(item => criarCard(item, true))
                .join("");

    }


    atualizarGraficos(
        agendamentos,
        agendados,
        feitos
    );

}


// ==========================================
// MARCAR COMO FEITO
// ==========================================

function marcarComoFeito(id) {

    const agendamentos =
        pegarAgendamentos();


    const agendamento =
        agendamentos.find(
            item => item.id === id
        );


    if (agendamento) {

        agendamento.status = "feito";

        salvarAgendamentos(
            agendamentos
        );

        atualizarPainel();

    }

}


// ==========================================
// EXCLUIR
// ==========================================

function excluirAgendamento(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este agendamento?"
        );


    if (!confirmar) {
        return;
    }


    let agendamentos =
        pegarAgendamentos();


    agendamentos =
        agendamentos.filter(
            item => item.id !== id
        );


    salvarAgendamentos(
        agendamentos
    );


    atualizarPainel();

}


// ==========================================
// GRÁFICOS
// ==========================================

function atualizarGraficos(
    agendamentos,
    agendados,
    feitos
) {


    // GRÁFICO DE STATUS

    const contextoStatus =
        document
            .getElementById("graficoStatus")
            .getContext("2d");


    if (graficoStatus) {

        graficoStatus.destroy();

    }


    graficoStatus =
        new Chart(
            contextoStatus,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Agendados",
                        "Feitos"
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


    // GRÁFICO DE SERVIÇOS

    const quantidadeServicos = {};


    agendamentos.forEach(
        function (agendamento) {

            const nome =
                agendamento.servico;

            if (
                !quantidadeServicos[nome]
            ) {

                quantidadeServicos[nome] = 0;

            }

            quantidadeServicos[nome]++;

        }
    );


    const nomesServicos =
        Object.keys(
            quantidadeServicos
        );


    const valoresServicos =
        Object.values(
            quantidadeServicos
        );


    const contextoServicos =
        document
            .getElementById("graficoServicos")
            .getContext("2d");


    if (graficoServicos) {

        graficoServicos.destroy();

    }


    graficoServicos =
        new Chart(
            contextoServicos,
            {

                type: "bar",

                data: {

                    labels: nomesServicos,

                    datasets: [

                        {

                            label: "Agendamentos",

                            data: valoresServicos,

                            backgroundColor:
                                "#d4af37",

                            borderRadius: 5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        x: {

                            ticks: {

                                color: "#ffffff"

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: "#ffffff",

                                stepSize: 1

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        }

                    },

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


// ==========================================
// INICIAR
// ==========================================

atualizarPainel();


// USUÁRIOS AUTORIZADOS
const usuariosPermitidos = [
    {
        usuario: "teste",
        senha: "1234"
    }
];

// FORMULÁRIO DE LOGIN
document
    .getElementById("loginAdmin")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const usuario =
            document.getElementById("usuario").value.trim();

        const senha =
            document.getElementById("senha").value;

        const mensagem =
            document.getElementById("mensagemLogin");


        // VERIFICA USUÁRIO E SENHA
        const usuarioEncontrado =
            usuariosPermitidos.find(function (dados) {

                return (
                    dados.usuario === usuario &&
                    dados.senha === senha
                );

            });


        // LOGIN CORRETO
        if (usuarioEncontrado) {

            sessionStorage.setItem(
                "adminLogado",
                "true"
            );

            window.location.href =
                "./admin.html";

        }


        // LOGIN INCORRETO
        else {

            mensagem.textContent =
                "Usuário ou senha incorretos.";

            mensagem.className =
                "login-erro";

        }

    });
