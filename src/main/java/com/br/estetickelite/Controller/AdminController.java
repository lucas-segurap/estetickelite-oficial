
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Agendamentos;
import com.br.estetickelite.Service.AgendamentosService;
import com.br.estetickelite.Service.MensagemContatoService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    // Abre a tela de login administrativo
    @GetMapping("/login")
    public String abrirLogin() {
        return "login-admin";
    }

    // Valida o login administrativo
    @PostMapping("/login")
    public String autenticar(
            @RequestParam("usuario") String usuario,
            @RequestParam("senha") String senha,
            HttpSession session) {

        if (usuarioAdmin == null || senhaAdmin == null
                || !usuarioAdmin.equals(usuario)
                || !senhaAdmin.equals(senha)) {

            return "redirect:/admin/login?erro";
        }

        session.setAttribute("adminLogado", true);

        return "redirect:/admin";
    }

    // Exibe o painel e carrega os agendamentos
    @GetMapping
    public String abrirPainel(
            HttpSession session,
            Model model) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        List<Agendamentos> agendamentos =
                agendamentosService.listarTodos();

        // Diagnóstico temporário no console do IntelliJ
        System.out.println("================================");
        System.out.println(
                "TOTAL DE AGENDAMENTOS: "
                        + agendamentos.size()
        );

        for (Agendamentos agendamento : agendamentos) {
            System.out.println(
                    "ID: " + agendamento.getId()
                            + " | Veículo: "
                            + agendamento.getVeiculo()
                            + " | Status: "
                            + agendamento.getStatus()
            );
        }

        System.out.println("================================");

        // Calcula os totais por status
        long totalAgendados = agendamentos.stream()
                .filter(a -> "AGENDADO".equalsIgnoreCase(
                        a.getStatus()))
                .count();

        long totalEmAndamento = agendamentos.stream()
                .filter(a -> "EM_ANDAMENTO".equalsIgnoreCase(
                        a.getStatus()))
                .count();

        long totalFeitos = agendamentos.stream()
                .filter(a -> "CONCLUIDO".equalsIgnoreCase(
                        a.getStatus()))
                .count();

        long totalCancelados = agendamentos.stream()
                .filter(a -> "CANCELADO".equalsIgnoreCase(
                        a.getStatus()))
                .count();

        // Envia os dados para admin.html
        model.addAttribute("agendamentos", agendamentos);
        System.out.println("AGENDAMENTOS ENVIADOS AO HTML: " + agendamentos.size());
        System.out.println("DADOS: " + agendamentos);
        model.addAttribute("totalAgendados", totalAgendados);
        model.addAttribute("totalEmAndamento", totalEmAndamento);
        model.addAttribute("totalFeitos", totalFeitos);
        model.addAttribute("totalCancelados", totalCancelados);
        model.addAttribute("totalServicos", agendamentos.size());

        return "admin";
    }

    // Inicia o atendimento
    @PostMapping("/agendamentos/{id}/iniciar")
    public String iniciarAtendimento(
            @PathVariable Long id,
            HttpSession session) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        agendamentosService.iniciarAtendimento(id);

        return "redirect:/admin";
    }

    // Conclui o atendimento
    @PostMapping("/agendamentos/{id}/concluir")
    public String concluirAgendamento(
            @PathVariable Long id,
            HttpSession session) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        agendamentosService.concluir(id);

        return "redirect:/admin";
    }

    // Cancela o agendamento
    @PostMapping("/agendamentos/{id}/cancelar")
    public String cancelarAgendamento(
            @PathVariable Long id,
            HttpSession session) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        agendamentosService.cancelar(id);

        return "redirect:/admin";
    }

    // Exclui o agendamento
    @PostMapping("/agendamentos/{id}/excluir")
    public String excluirAgendamento(
            @PathVariable Long id,
            HttpSession session) {

        if (!estaAutenticado(session)) {
            return "redirect:/admin/login";
        }

        agendamentosService.excluir(id);

        return "redirect:/admin";
    }

    // Exibe as mensagens recebidas
    @GetMapping("/mensagens")
    public String abrirMensagens(
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

    // Encerra a sessão administrativa
    @PostMapping("/logout")
    public String logout(HttpSession session) {

        session.removeAttribute("adminLogado");

        return "redirect:/admin/login?logout";
    }

    // Verifica se o administrador está autenticado
    private boolean estaAutenticado(HttpSession session) {
        return Boolean.TRUE.equals(
                session.getAttribute("adminLogado")
        );
    }
}
