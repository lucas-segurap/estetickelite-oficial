(() => {
    const form = document.getElementById("formCadastro");
    const senha = document.getElementById("senha");
    const confirmar = document.getElementById("confirmarSenha");
    const erro = document.getElementById("erroSenha");
    const cpf = document.getElementById("cpf");
    const telefone = document.getElementById("telefone");

    function validarSenhas() {
        const iguais = senha.value === confirmar.value;

        confirmar.setCustomValidity(
            iguais ? "" : "As senhas não coincidem."
        );

        erro.textContent =
            iguais || !confirmar.value
                ? ""
                : "As senhas não coincidem.";

        return iguais;
    }

    senha.addEventListener("input", validarSenhas);
    confirmar.addEventListener("input", validarSenhas);

    cpf.addEventListener("input", () => {
        let valor = cpf.value.replace(/\D/g, "").slice(0, 11);

        if (valor.length > 9) {
            valor = valor.replace(
                /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
                "$1.$2.$3-$4"
            );
        } else if (valor.length > 6) {
            valor = valor.replace(
                /^(\d{3})(\d{3})(\d+)$/,
                "$1.$2.$3"
            );
        } else if (valor.length > 3) {
            valor = valor.replace(
                /^(\d{3})(\d+)$/,
                "$1.$2"
            );
        }

        cpf.value = valor;
    });

    telefone.addEventListener("input", () => {
        let valor = telefone.value.replace(/\D/g, "").slice(0, 11);

        if (valor.length > 10) {
            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );
        } else if (valor.length > 6) {
            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                (_, ddd, parte1, parte2) =>
                    `(${ddd}) ${parte1}${parte2 ? "-" + parte2 : ""}`
            );
        } else if (valor.length > 2) {
            valor = valor.replace(
                /^(\d{2})(\d+)$/,
                "($1) $2"
            );
        }

        telefone.value = valor;
    });

    form.addEventListener("submit", (event) => {
        if (!validarSenhas()) {
            event.preventDefault();
            confirmar.reportValidity();
        }
    });
})();