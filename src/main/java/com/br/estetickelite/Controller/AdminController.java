
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

        System.out.println("=== PAINEL ADMINISTRATIVO ===");

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        List<Agendamentos> agendamentos =
                agendamentosService.listarTodos();

        long totalAgendados = agendamentos.stream()
                .filter(a -> a.getStatus() == null
                        || "AGENDADO".equalsIgnoreCase(a.getStatus()))
                .count();

        long totalFeitos = agendamentos.stream()
                .filter(a -> "CONCLUIDO".equalsIgnoreCase(a.getStatus()))
                .count();

        long totalServicos = agendamentos.size();

        double taxaConclusao = totalServicos == 0
                ? 0
                : totalFeitos * 100.0 / totalServicos;

        model.addAttribute("agendamentos", agendamentos);
        model.addAttribute("totalAgendados", totalAgendados);
        model.addAttribute("totalFeitos", totalFeitos);
        model.addAttribute("totalServicos", totalServicos);
        model.addAttribute("taxaConclusao",
                Math.round(taxaConclusao * 10.0) / 10.0);

        

        return "admin";
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
