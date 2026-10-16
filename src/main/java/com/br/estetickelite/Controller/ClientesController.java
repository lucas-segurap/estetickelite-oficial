
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Service.ClientesService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/clientes")
public class ClientesController {

    private final ClientesService clientesService;

    public ClientesController(ClientesService clientesService) {
        this.clientesService = clientesService;
    }

    // Exibe o formulário de cadastro
    @GetMapping("/novo")
    public String novo(Model model) {
        model.addAttribute("cliente", new Clientes());
        return "clientes/cadastro";
    }

    // Recebe e salva o formulário
    @PostMapping("/salvar")
    public String salvar(
            @ModelAttribute("cliente") Clientes cliente,
            RedirectAttributes redirectAttributes) {

        clientesService.salvar(cliente);

        redirectAttributes.addFlashAttribute(
                "mensagem",
                "Cliente cadastrado com sucesso!"
        );

        return "redirect:/clientes/listar";
    }

    // Exibe todos os clientes
    @GetMapping("/listar")
    public String listar(Model model) {
        List<Clientes> clientes = clientesService.listarTodos();
        model.addAttribute("clientes", clientes);

        return "clientes/lista";
    }
}
