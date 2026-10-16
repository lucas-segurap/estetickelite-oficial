
/* =========================================================
   ESTETICKELITE
   LOGIN DO CLIENTE
   Arquivo: login.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // =====================================================
    // ELEMENTOS DO FORMULÁRIO
    // =====================================================

    const formulario = document.querySelector(
        'form[action$="/login"]'
    );

    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");

    if (!formulario || !campoEmail || !campoSenha) {
        return;
    }

    // =====================================================
    // VALIDAÇÃO BÁSICA DO FORMULÁRIO
    // =====================================================

    formulario.addEventListener("submit", function (evento) {

        const email = campoEmail.value.trim();
        const senha = campoSenha.value;

        // Evita enviar campos vazios
        if (email === "" || senha.trim() === "") {
            evento.preventDefault();

            if (email === "") {
                campoEmail.focus();
            } else {
                campoSenha.focus();
            }

            return;
        }

        // Utiliza a validação nativa do navegador
        if (!formulario.checkValidity()) {
            evento.preventDefault();
            formulario.reportValidity();
        }
    });

    // =====================================================
    // MANTÉM O E-MAIL SEM ESPAÇOS NAS EXTREMIDADES
    // =====================================================

    campoEmail.addEventListener("blur", function () {
        campoEmail.value = campoEmail.value.trim();
    });

    // =====================================================
    // ACESSIBILIDADE: INDICAÇÃO DOS CAMPOS
    // =====================================================

    [campoEmail, campoSenha].forEach(function (campo) {

        campo.addEventListener("input", function () {
            campo.removeAttribute("aria-invalid");
        });

    });

});
