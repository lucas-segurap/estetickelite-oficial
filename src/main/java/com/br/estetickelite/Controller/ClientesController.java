
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Service.ClientesService;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class ClientesController {

    private final ClientesService clientesService;

    public ClientesController(ClientesService clientesService) {
        this.clientesService = clientesService;
    }

    // Exibe o formulário de cadastro
    @GetMapping("/cadastro")
    public String cadastro(Model model) {
        model.addAttribute("cliente", new Clientes());
        return "cadastro";
    }

    // Recebe e valida os dados do formulário
    @PostMapping("/cadastro")
    public String salvar(
            @ModelAttribute("cliente") Clientes cliente,
            BindingResult resultado,
            @RequestParam("confirmarSenha") String confirmarSenha,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (resultado.hasErrors()) {
            return "cadastro";
        }

        // Confere se as senhas são iguais
        if (cliente.getSenha() == null
                || !cliente.getSenha().equals(confirmarSenha)) {

            model.addAttribute(
                    "erroSenha",
                    "As senhas não coincidem."
            );

            return "cadastro";
        }

        // Verifica CPF duplicado
        if (clientesService.cpfExiste(cliente.getCpf())) {

            model.addAttribute(
                    "erroCadastro",
                    "Este CPF já está cadastrado."
            );

            return "cadastro";
        }

        // Verifica e-mail duplicado
        if (clientesService.emailExiste(cliente.getEmail())) {

            model.addAttribute(
                    "erroCadastro",
                    "Este e-mail já está cadastrado."
            );

            return "cadastro";
        }

        // Salva o cliente e criptografa a senha no serviço
        clientesService.salvar(cliente);

        redirectAttributes.addFlashAttribute(
                "mensagem",
                "Cadastro realizado com sucesso!"
        );

        return "redirect:/login?sucesso";
    }

    // Lista os clientes
    @GetMapping("/clientes/listar")
    public String listar(Model model) {

        List<Clientes> clientes =
                clientesService.listarTodos();

        model.addAttribute("clientes", clientes);

        return "clientes/lista";
    }
}
