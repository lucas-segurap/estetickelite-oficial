
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

    // =====================================================
    // LOGIN DO CLIENTE
    // =====================================================

    @GetMapping("/login")
    public String abrirLoginCliente() {
        return "login";
    }
    @PostMapping("/login")
    public String autenticar(
            @RequestParam("email") String email,
            @RequestParam("senha") String senha,
            HttpSession session) {

        Clientes cliente = clientesRepository
                .findByEmail(email)
                .orElse(null);

        if (cliente == null
                || cliente.getSenha() == null
                || !passwordEncoder.matches(
                senha,
                cliente.getSenha())) {

            return "redirect:/login?erro";
        }

        session.setAttribute("clienteId", cliente.getId());
        session.setAttribute("clienteNome", cliente.getNome());

        return "redirect:/";
    }

    // =====================================================
    // PÁGINA DE LOGIN ADMINISTRATIVO
    // =====================================================


    @GetMapping("/teste-sessao")
    public String testeSessao(
            HttpSession session,
            Model model) {

        Object clienteId = session.getAttribute("clienteId");
        Object clienteNome = session.getAttribute("clienteNome");

        if (clienteId == null) {
            return "redirect:/login?erro";
        }

        model.addAttribute("clienteId", clienteId);
        model.addAttribute("clienteNome", clienteNome);

        return "teste-sessao";
    }

    // =====================================================
    // LOGOUT DO CLIENTE
    // =====================================================

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout";
    }
}
