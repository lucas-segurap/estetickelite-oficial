
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Repository.ClientesRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final ClientesRepository clientesRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginController(ClientesRepository clientesRepository) {
        this.clientesRepository = clientesRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Exibe a página de login
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Autentica o cliente
    @PostMapping("/login")
    public String autenticar(
            @RequestParam("email") String email,
            @RequestParam("senha") String senha,
            HttpSession session) {

        Clientes cliente = clientesRepository
                .findByEmail(email)
                .orElse(null);

        // Verifica se o cliente existe e se a senha está correta
        if (cliente == null
                || cliente.getSenha() == null
                || !passwordEncoder.matches(
                senha,
                cliente.getSenha())) {

            return "redirect:/login?erro";
        }

        // Guarda os dados do cliente na sessão
        session.setAttribute("clienteId", cliente.getId());
        session.setAttribute("clienteNome", cliente.getNome());

        return "redirect:/";
    }

    // Testa se a sessão do cliente está funcionando
    @GetMapping("/teste-sessao")
    public String testeSessao(
            HttpSession session,
            Model model) {

        Object clienteId = session.getAttribute("clienteId");
        Object clienteNome = session.getAttribute("clienteNome");

        // Se não estiver conectado, volta para o login
        if (clienteId == null) {
            return "redirect:/login?erro";
        }

        model.addAttribute("clienteId", clienteId);
        model.addAttribute("clienteNome", clienteNome);

        return "teste-sessao";
    }

    // Encerra a sessão do cliente
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout";
    }
}
