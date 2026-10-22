
/* =====================================================
   ESTETICKELITE
   PAGAMENTO DEMONSTRATIVO
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Opções de pagamento
    const pagamentoPix = document.getElementById("pagamentoPix");
    const pagamentoCartao = document.getElementById("pagamentoCartao");

    // Painéis
    const areaPix = document.getElementById("areaPix");
    const areaCartao = document.getElementById("areaCartao");

    // Elementos da demonstração Pix
    const copiarPixDemo = document.getElementById("copiarPixDemo");
    const mensagemPixDemo = document.getElementById("mensagemPixDemo");

    // Campos demonstrativos do cartão
    const numeroCartaoDemo = document.getElementById("numeroCartaoDemo");
    const titularCartaoDemo = document.getElementById("titularCartaoDemo");
    const validadeCartaoDemo = document.getElementById("validadeCartaoDemo");
    const cvvCartaoDemo = document.getElementById("cvvCartaoDemo");

    // Pré-visualização do cartão
    const cartaoNumeroPreview = document.getElementById("cartaoNumeroPreview");
    const cartaoTitularPreview = document.getElementById("cartaoTitularPreview");
    const cartaoValidadePreview = document.getElementById("cartaoValidadePreview");

    /*
     * Mostra o painel correspondente à forma selecionada.
     */
    function atualizarFormaPagamento() {

        if (!areaPix || !areaCartao) {
            return;
        }

        const pixSelecionado = pagamentoPix && pagamentoPix.checked;
        const cartaoSelecionado = pagamentoCartao && pagamentoCartao.checked;

        areaPix.hidden = !pixSelecionado;
        areaCartao.hidden = !cartaoSelecionado;
    }

    if (pagamentoPix) {
        pagamentoPix.addEventListener("change", atualizarFormaPagamento);
    }

    if (pagamentoCartao) {
        pagamentoCartao.addEventListener("change", atualizarFormaPagamento);
    }

    atualizarFormaPagamento();

    /*
     * O Pix ainda não é real.
     * Não existe código para copiar ou pagamento para confirmar.
     */
    if (copiarPixDemo && mensagemPixDemo) {

        copiarPixDemo.addEventListener("click", function () {

            mensagemPixDemo.textContent =
                "Demonstração: o QR Code real será disponibilizado após a integração de pagamento.";
        });
    }

    /*
     * Formata o número digitado para a visualização.
     * Não transmite nem salva os dados do cartão.
     */
    if (numeroCartaoDemo && cartaoNumeroPreview) {

        numeroCartaoDemo.addEventListener("input", function () {

            const numeros = this.value
                .replace(/\D/g, "")
                .slice(0, 16);

            this.value = numeros.replace(/(\d{4})(?=\d)/g, "$1 ");

            cartaoNumeroPreview.textContent = numeros
                ? numeros.replace(/(\d{4})(?=\d)/g, "$1 ")
                : "•••• •••• •••• ••••";
        });
    }

    /*
     * Atualiza o nome exibido no cartão.
     */
    if (titularCartaoDemo && cartaoTitularPreview) {

        titularCartaoDemo.addEventListener("input", function () {

            const nome = this.value.trim().toUpperCase();

            cartaoTitularPreview.textContent =
                nome || "NOME DO TITULAR";
        });
    }

    /*
     * Formata a validade como MM/AA.
     */
    if (validadeCartaoDemo && cartaoValidadePreview) {

        validadeCartaoDemo.addEventListener("input", function () {

            let numeros = this.value.replace(/\D/g, "").slice(0, 4);

            if (numeros.length > 2) {
                numeros = numeros.slice(0, 2) + "/" + numeros.slice(2);
            }

            this.value = numeros;

            cartaoValidadePreview.textContent =
                numeros || "MM/AA";
        });
    }

    /*
     * Limita o campo CVV demonstrativo a números.
     * O valor não é exibido no cartão nem enviado pelo formulário.
     */
    if (cvvCartaoDemo) {

        cvvCartaoDemo.addEventListener("input", function () {

            this.value = this.value
                .replace(/\D/g, "")
                .slice(0, 4);
        });
    }

});
