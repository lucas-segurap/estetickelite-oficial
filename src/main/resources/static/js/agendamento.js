// =====================================================
// AGENDAMENTO ESTETICKELITE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formAgendamento");

    if (!formulario) {
        console.error("ERRO: formAgendamento não encontrado.");
        return;
    }


    // =====================================================
    // CAMPO DE DATA
    // =====================================================

    const campoData = document.getElementById("dataCliente");

    if (campoData) {

        campoData.addEventListener("input", function () {

            // Remove tudo que não for número
            let valor = this.value.replace(/\D/g, "");

            // Limita para 8 números: DDMMYYYY
            valor = valor.substring(0, 8);

            // Formata a data
            if (valor.length > 4) {

                valor =
                    valor.substring(0, 2) +
                    "/" +
                    valor.substring(2, 4) +
                    "/" +
                    valor.substring(4, 8);

            } else if (valor.length > 2) {

                valor =
                    valor.substring(0, 2) +
                    "/" +
                    valor.substring(2);

            }

            this.value = valor;
        });


        // =====================================================
        // VALIDAR DATA AO SAIR DO CAMPO
        // =====================================================

        campoData.addEventListener("blur", function () {

            const valor = campoData.value.trim();

            if (valor === "") {
                return;
            }

            const partes = valor.split("/");

            if (
                partes.length !== 3 ||
                partes[0].length !== 2 ||
                partes[1].length !== 2 ||
                partes[2].length !== 4
            ) {

                alert("Digite a data no formato DD/MM/AAAA.");

                campoData.value = "";

                return;
            }


            const dia = Number(partes[0]);
            const mes = Number(partes[1]);
            const ano = Number(partes[2]);


            // =====================================================
            // VERIFICAR DIA E MÊS
            // =====================================================

            if (
                dia < 1 ||
                dia > 31 ||
                mes < 1 ||
                mes > 12
            ) {

                alert("Digite uma data válida.");

                campoData.value = "";

                return;
            }


            // =====================================================
            // VERIFICAR SE A DATA EXISTE
            // =====================================================

            const dataSelecionada = new Date(
                ano,
                mes - 1,
                dia
            );


            if (
                dataSelecionada.getFullYear() !== ano ||
                dataSelecionada.getMonth() !== mes - 1 ||
                dataSelecionada.getDate() !== dia
            ) {

                alert("Essa data não existe.");

                campoData.value = "";

                return;
            }


            // =====================================================
            // DATA DE HOJE
            // =====================================================

            const hoje = new Date();

            hoje.setHours(0, 0, 0, 0);
            dataSelecionada.setHours(0, 0, 0, 0);


            // Não permite data passada
            if (dataSelecionada < hoje) {

                alert("Não é possível agendar para uma data passada.");

                campoData.value = "";

                return;
            }


            // =====================================================
            // LIMITE DE 2 ANOS
            // =====================================================

            const limite = new Date();

            limite.setFullYear(
                limite.getFullYear() + 2
            );

            limite.setHours(23, 59, 59, 999);


            if (dataSelecionada > limite) {

                alert("Escolha uma data dentro dos próximos 2 anos.");

                campoData.value = "";

                return;
            }

        });
    }


    // =====================================================
    // FORMULÁRIO
    // =====================================================

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();


        // =====================================================
        // PEGAR DADOS
        // =====================================================

        const nome =
            document
                .getElementById("nomeCliente")
                .value
                .trim();


        const veiculo =
            document
                .getElementById("veiculoCliente")
                .value
                .trim();


        const placa =
            document
                .getElementById("placa-veiculo")
                .value
                .trim()
                .toUpperCase();


        const email =
            document
                .getElementById("emailCliente")
                .value
                .trim();


        const servico =
            document
                .getElementById("servicoCliente")
                .value;


        const dataDigitada =
            document
                .getElementById("dataCliente")
                .value
                .trim();


        const horario =
            document
                .getElementById("horarioCliente")
                .value;


        const observacoes =
            document
                .getElementById("observacoesCliente")
                .value
                .trim();


        // =====================================================
        // PAGAMENTO
        // =====================================================

        const pagamento =
            document.querySelector(
                'input[name="pagamento"]:checked'
            );


        if (!pagamento) {

            alert("Selecione uma forma de pagamento.");

            return;
        }


        // =====================================================
        // VALIDAR DATA
        // =====================================================

        const partesData =
            dataDigitada.split("/");


        if (
            partesData.length !== 3 ||
            partesData[0].length !== 2 ||
            partesData[1].length !== 2 ||
            partesData[2].length !== 4
        ) {

            alert(
                "Digite uma data válida no formato DD/MM/AAAA."
            );

            return;
        }


        const dia =
            Number(partesData[0]);


        const mes =
            Number(partesData[1]);


        const ano =
            Number(partesData[2]);


        const dataObjeto =
            new Date(
                ano,
                mes - 1,
                dia
            );


        // =====================================================
        // VERIFICAR SE A DATA EXISTE
        // =====================================================

        if (
            dataObjeto.getFullYear() !== ano ||
            dataObjeto.getMonth() !== mes - 1 ||
            dataObjeto.getDate() !== dia
        ) {

            alert("Digite uma data válida.");

            return;
        }


        // =====================================================
        // COMPARAR COM HOJE
        // =====================================================

        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);
        dataObjeto.setHours(0, 0, 0, 0);


        if (dataObjeto < hoje) {

            alert(
                "Não é possível agendar para uma data passada."
            );

            return;
        }


        // =====================================================
        // CONVERTER PARA O FORMATO DO PAINEL
        //
        // DD/MM/AAAA
        //       ↓
        // AAAA-MM-DD
        // =====================================================

        const data =
            `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        // =====================================================
        // CRIAR AGENDAMENTO
        // =====================================================

        const novoAgendamento = {

            id: Date.now(),

            nome: nome,

            veiculo: veiculo,

            placa: placa,

            email: email,

            servico: servico,

            data: data,

            horario: horario,

            observacoes:
                observacoes || "Nenhuma observação",

            pagamento: pagamento.value,

            status: "agendado"

        };


        // =====================================================
        // PEGAR AGENDAMENTOS SALVOS
        // =====================================================

        let agendamentos = [];

        try {

            const dadosSalvos =
                localStorage.getItem(
                    "agendamentosEstetickElite"
                );


            if (dadosSalvos) {

                agendamentos =
                    JSON.parse(dadosSalvos);

            }


            if (!Array.isArray(agendamentos)) {

                agendamentos = [];

            }

        } catch (erro) {

            console.error(
                "Erro ao ler agendamentos:",
                erro
            );

            agendamentos = [];

        }


        // =====================================================
        // ADICIONAR NOVO AGENDAMENTO
        // =====================================================

        agendamentos.push(novoAgendamento);


        // =====================================================
        // SALVAR
        // =====================================================

        try {

            localStorage.setItem(
                "agendamentosEstetickElite",
                JSON.stringify(agendamentos)
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar agendamento:",
                erro
            );

            alert(
                "Não foi possível salvar o agendamento."
            );

            return;
        }


        // =====================================================
        // MENSAGEM
        // =====================================================

        const mensagem =
            document.getElementById(
                "mensagemAgendamento"
            );


        if (mensagem) {

            mensagem.innerHTML = `

                <div class="alert alert-success">

                    <strong>
                        Agendamento realizado com sucesso!
                    </strong>

                    <br>

                    Seu agendamento foi enviado para o painel administrativo.

                </div>

            `;

        }


        alert(
            "Agendamento realizado com sucesso!"
        );


        // =====================================================
        // CONSOLE
        // =====================================================

        console.log(
            "================================="
        );

        console.log(
            "AGENDAMENTO SALVO"
        );

        console.log(
            "================================="
        );

        console.log(novoAgendamento);

        console.log(
            "================================="
        );

        console.log(
            "TODOS OS AGENDAMENTOS"
        );

        console.log(agendamentos);

        console.log(
            "================================="
        );


        // =====================================================
        // LIMPAR FORMULÁRIO
        // =====================================================

        formulario.reset();

    });

});


const dataCliente = document.getElementById("dataCliente");

dataCliente.addEventListener("input", function () {

    // Pega somente números
    let valor = this.value.replace(/\D/g, "");

    // Limita para 8 números:
    // DD MM AAAA
    valor = valor.substring(0, 8);

    // Coloca a primeira barra
    if (valor.length > 2) {
        valor =
            valor.substring(0, 2) +
            "/" +
            valor.substring(2);
    }

    // Coloca a segunda barra
    if (valor.length > 5) {
        valor =
            valor.substring(0, 5) +
            "/" +
            valor.substring(5);
    }

    // Mantém o formato DD/MM/AAAA
    this.value = valor;

});

