
/* =====================================================
   ESTETICKELITE
   AGENDAMENTO
   Integração com Spring Boot + Thymeleaf
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formAgendamento");
    const campoData = document.getElementById("dataCliente");
    const campoHorario = document.getElementById("horarioCliente");

    if (!formulario) {
        console.warn("Formulário de agendamento não encontrado.");
        return;
    }

    // =====================================================
    // FORMATAR DATA: DD/MM/AAAA
    // =====================================================

    if (campoData) {
        campoData.addEventListener("input", function () {

            let valor = this.value.replace(/\D/g, "").substring(0, 8);

            if (valor.length > 4) {
                valor =
                    valor.substring(0, 2) + "/" +
                    valor.substring(2, 4) + "/" +
                    valor.substring(4);
            } else if (valor.length > 2) {
                valor =
                    valor.substring(0, 2) + "/" +
                    valor.substring(2);
            }

            this.value = valor;
        });
    }

    // =====================================================
    // VALIDAR DATA
    // =====================================================

    function validarData(valor) {

        const correspondencia =
            /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);

        if (!correspondencia) {
            return false;
        }

        const dia = Number(correspondencia[1]);
        const mes = Number(correspondencia[2]);
        const ano = Number(correspondencia[3]);

        const data = new Date(ano, mes - 1, dia);

        if (
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            return false;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        data.setHours(0, 0, 0, 0);

        return data >= hoje;
    }

    // =====================================================
    // ENVIAR FORMULÁRIO AO SPRING BOOT
    // =====================================================

    formulario.addEventListener("submit", function (event) {

        const dataDigitada = campoData
            ? campoData.value.trim()
            : "";

        if (!validarData(dataDigitada)) {
            event.preventDefault();

            alert(
                "Informe uma data válida, no formato DD/MM/AAAA, " +
                "que não seja anterior a hoje."
            );

            if (campoData) {
                campoData.focus();
            }

            return;
        }

        // Verifica se o horário foi selecionado.
        if (!campoHorario || !campoHorario.value) {
            event.preventDefault();

            alert("Selecione um horário para o agendamento.");

            if (campoHorario) {
                campoHorario.focus();
            }

            return;
        }

        // Verifica se a forma de pagamento foi selecionada.
        const pagamentoSelecionado = formulario.querySelector(
            'input[name="pagamento"]:checked'
        );

        if (!pagamentoSelecionado) {
            event.preventDefault();
            alert("Selecione uma forma de pagamento.");
            return;
        }

        // Confirmação obrigatória, conforme o Controller Java.
        const confirmacao = formulario.querySelector(
            'input[name="confirmacao"]'
        );

        if (!confirmacao || !confirmacao.checked) {
            event.preventDefault();
            alert("Confirme as informações do agendamento.");

            if (confirmacao) {
                confirmacao.focus();
            }

            return;
        }

        /*
         * Não usar preventDefault() quando tudo estiver válido.
         *
         * O navegador enviará os dados ao POST /agendamento.
         * O Spring Boot validará e salvará o agendamento.
         */
    });

});
