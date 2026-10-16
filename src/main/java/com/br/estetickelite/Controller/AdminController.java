
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Agendamentos;
import com.br.estetickelite.Service.AgendamentosService;
import com.br.estetickelite.Service.MensagemContatoService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final AgendamentosService agendamentosService;
    private final MensagemContatoService mensagemContatoService;

    @Value("${admin.usuario}")
    private String usuarioAdmin;

    @Value("${admin.senha}")
    private String senhaAdmin;

    public AdminController(
            AgendamentosService agendamentosService,
            MensagemContatoService mensagemContatoService) {

        this.agendamentosService = agendamentosService;
        this.mensagemContatoService = mensagemContatoService;
    }

    // Abre a página de login administrativo
    @GetMapping("/login")
    public String abrirLogin() {
        return "login-admin";
    }

    // Valida o acesso administrativo

    // Abre o painel administrativo
    @GetMapping
    public String abrirPainel(
            HttpSession session,
            Model model) {

        System.out.println("=== TESTE PAINEL ADMIN ===");
        System.out.println("Sessão: " + session.getId());
        System.out.println("Admin logado: "
                + session.getAttribute("adminLogado"));

        if (!estaAutenticado(session)) {
            System.out.println("Acesso negado: sessão administrativa ausente.");
            return "redirect:/admin/login";
        }

        System.out.println("Sessão válida. Abrindo admin.html.");

        List<Agendamentos> agendamentos =
                agendamentosService.listarTodos();

        model.addAttribute("agendamentos", agendamentos);
        model.addAttribute("totalServicos", agendamentos.size());
        model.addAttribute("totalAgendados", agendamentos.size());
        model.addAttribute("totalFeitos", 0);
        model.addAttribute("taxaConclusao", 0);

        return "redirect:/admin/teste";
    }
    @PostMapping("/login")
    public String autenticar(
            @RequestParam("usuario") String usuario,
            @RequestParam("senha") String senha,
            HttpSession session) {

        System.out.println("=== LOGIN ADMINISTRATIVO ===");
        System.out.println("Usuário recebido: " + usuario);

        if (!usuarioAdmin.equals(usuario)
                || !senhaAdmin.equals(senha)) {

            System.out.println("Credenciais inválidas.");
            return "redirect:/admin/login?erro";
        }

        session.setAttribute("adminLogado", true);

        System.out.println("Login validado.");
        System.out.println("Sessão: " + session.getId());
        System.out.println("Admin logado: "
                + session.getAttribute("adminLogado"));

        return "redirect:/admin";
    }



    // Lista as mensagens recebidas pelo Fale Conosco
    @GetMapping("/mensagens")
    public String listarMensagens(
            HttpSession session,
            Model model) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        model.addAttribute(
                "mensagens",
                mensagemContatoService.listarTodas()
        );

        return "mensagens-admin";
    }

    // Encerra somente a sessão administrativa
    @PostMapping("/logout")
    public String logout(HttpSession session) {

        session.removeAttribute("adminLogado");

        return "redirect:/admin/login?logout";
    }

    private boolean estaAutenticado(HttpSession session) {
        return Boolean.TRUE.equals(
                session.getAttribute("adminLogado")
        );
    }

}
