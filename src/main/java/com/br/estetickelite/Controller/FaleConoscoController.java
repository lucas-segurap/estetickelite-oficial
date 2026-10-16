
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.MensagemContato;
import com.br.estetickelite.Service.MensagemContatoService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class FaleConoscoController {

    private final MensagemContatoService mensagemContatoService;

    public FaleConoscoController(
            MensagemContatoService mensagemContatoService) {
        this.mensagemContatoService = mensagemContatoService;
    }

    @GetMapping("/faleconosco")
    public String abrirFaleConosco(Model model) {
        model.addAttribute(
                "mensagemContato",
                new MensagemContato()
        );

        return "faleconosco";
    }

    @PostMapping("/faleconosco")
    public String receberMensagem(
            @ModelAttribute("mensagemContato")
            MensagemContato mensagemContato,
            BindingResult resultado,
            Model model) {

        if (mensagemContato.getNome() == null
                || mensagemContato.getNome().isBlank()
                || mensagemContato.getEmail() == null
                || mensagemContato.getEmail().isBlank()
                || mensagemContato.getAssunto() == null
                || mensagemContato.getAssunto().isBlank()
                || mensagemContato.getMensagem() == null
                || mensagemContato.getMensagem().isBlank()) {

            model.addAttribute(
                    "erro",
                    "Preencha todos os campos antes de enviar."
            );

            return "faleconosco";
        }

        try {
            mensagemContatoService.salvar(mensagemContato);

            model.addAttribute(
                    "sucesso",
                    "Mensagem enviada com sucesso!"
            );

            model.addAttribute(
                    "mensagemContato",
                    new MensagemContato()
            );

        } catch (Exception e) {
            model.addAttribute(
                    "erro",
                    "Não foi possível enviar a mensagem. Tente novamente."
            );
        }

        return "faleconosco";
    }
}
