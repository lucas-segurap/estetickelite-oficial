
package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Agendamentos;
import com.br.estetickelite.Service.AgendamentosService;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.Map;

@Controller
public class AgendamentoController {

    private final AgendamentosService agendamentosService;

    public AgendamentoController(
            AgendamentosService agendamentosService) {
        this.agendamentosService = agendamentosService;
    }

    // =====================================================
    // ABRIR PÁGINA DE AGENDAMENTO
    // Não exige login para visualizar a página.
    // =====================================================

    @GetMapping("/agendamento")
    public String abrirAgendamento() {
        return "agendamento";
    }

    // =====================================================
    // SALVAR AGENDAMENTO
    // =====================================================

    @PostMapping("/agendamento")
    public String salvarAgendamento(
            @RequestParam("veiculoCliente") String veiculo,
            @RequestParam("servico") String servico,
            @RequestParam("dataCliente") String dataTexto,
            @RequestParam("horarioCliente") String horarioTexto,
            @RequestParam(
                    value = "observacoesCliente",
                    required = false) String observacoes,
            @RequestParam("pagamento") String pagamento,
            @RequestParam(
                    value = "confirmacao",
                    defaultValue = "false") boolean confirmacao,
            HttpSession session) {

        // O cliente precisa estar conectado para salvar.
        Object clienteIdSessao = session.getAttribute("clienteId");

        if (clienteIdSessao == null) {
            return "redirect:/login?necessario";
        }

        // Verifica a confirmação do formulário.
        if (!confirmacao) {
            return "redirect:/agendamento?erro=confirmacao";
        }

        try {
            // =============================================
            // VALIDAR DATA E HORÁRIO
            // =============================================

            DateTimeFormatter formatoData =
                    DateTimeFormatter.ofPattern("dd/MM/uuuu")
                            .withResolverStyle(ResolverStyle.STRICT);

            LocalDate data = LocalDate.parse(
                    dataTexto,
                    formatoData);

            LocalTime horario = LocalTime.parse(horarioTexto);

            if (data.isBefore(LocalDate.now())) {
                return "redirect:/agendamento?erro=data";
            }

            // =============================================
            // SERVIÇOS DISPONÍVEIS
            // =============================================

            Map<String, Integer> servicos = Map.ofEntries(
                    Map.entry("Lavagem técnica", 1),
                    Map.entry("Enceramento Wax", 2),
                    Map.entry("Revitalização de plásticos", 3),
                    Map.entry("Polimento de Pintura", 4),
                    Map.entry("Revitalização de Plásticos Internos", 5),
                    Map.entry("Vitrificação de Vidros", 6),
                    Map.entry("Descontaminação de Pintura", 7),
                    Map.entry("Polimento de Faróis", 8),
                    Map.entry("Combo Start", 9),
                    Map.entry("Combo Premium", 10),
                    Map.entry("Combo Elite", 11)
            );

            // =============================================
            // PREÇOS DOS SERVIÇOS
            // =============================================

            Map<String, BigDecimal> precos = Map.ofEntries(
                    Map.entry("Lavagem técnica", new BigDecimal("80.00")),
                    Map.entry("Enceramento Wax", new BigDecimal("250.00")),
                    Map.entry("Revitalização de plásticos", new BigDecimal("480.00")),
                    Map.entry("Polimento de Pintura", new BigDecimal("700.00")),
                    Map.entry("Revitalização de Plásticos Internos", new BigDecimal("380.00")),
                    Map.entry("Vitrificação de Vidros", new BigDecimal("600.00")),
                    Map.entry("Descontaminação de Pintura", new BigDecimal("580.00")),
                    Map.entry("Polimento de Faróis", new BigDecimal("150.00")),
                    Map.entry("Combo Start", new BigDecimal("300.00")),
                    Map.entry("Combo Premium", new BigDecimal("750.00")),
                    Map.entry("Combo Elite", new BigDecimal("1300.00"))
            );

            Integer tipoServico = servicos.get(servico);
            BigDecimal total = precos.get(servico);

            if (tipoServico == null || total == null) {
                return "redirect:/agendamento?erro=servico";
            }

            // =============================================
            // FORMA DE PAGAMENTO
            // =============================================

            Integer formaPagamento = switch (pagamento) {
                case "Pix" -> 1;
                case "Cartão" -> 2;
                case "Pagamento em loja" -> 3;
                default -> null;
            };

            if (formaPagamento == null) {
                return "redirect:/agendamento?erro=pagamento";
            }

            // =============================================
            // CRIAR AGENDAMENTO
            // =============================================

            Agendamentos agendamento = new Agendamentos();

            agendamento.setClienteId(
                    Long.valueOf(clienteIdSessao.toString()));

            agendamento.setVeiculo(veiculo);
            agendamento.setData(data);
            agendamento.setHorario(horario);
            agendamento.setObservacoes(observacoes);
            agendamento.setTipoServicos(tipoServico);
            agendamento.setTotalServicos(total);
            agendamento.setFormaPag(formaPagamento);

            // Salvar no banco de dados.
            agendamentosService.salvar(agendamento);

            return "redirect:/agendamento?sucesso";

        } catch (DateTimeParseException e) {
            return "redirect:/agendamento?erro=data";
        }
    }
}
