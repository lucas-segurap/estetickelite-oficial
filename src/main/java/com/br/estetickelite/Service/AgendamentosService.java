package com.br.estetickelite.Service;

import com.br.estetickelite.Model.Agendamentos;
import com.br.estetickelite.Repository.AgendamentosRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AgendamentosService {

    private final AgendamentosRepository agendamentosRepository;

    public AgendamentosService(
            AgendamentosRepository agendamentosRepository) {
        this.agendamentosRepository = agendamentosRepository;
    }

    public Agendamentos salvar(Agendamentos agendamento) {
        if (agendamento.getStatus() == null
                || agendamento.getStatus().isBlank()) {
            agendamento.setStatus("AGENDADO");
        }

        return agendamentosRepository.save(agendamento);
    }

    public List<Agendamentos> listarTodos() {
        return agendamentosRepository.findAll();
    }

    public Agendamentos buscarPorId(Long id) {
        return agendamentosRepository.findById(id).orElse(null);
    }

    @Transactional
    public void iniciarAtendimento(Long id) {
        Agendamentos agendamento = obterAgendamento(id);

        validarStatus(agendamento, "AGENDADO");

        agendamento.setStatus("EM_ANDAMENTO");
        agendamentosRepository.save(agendamento);
    }

    @Transactional
    public void concluir(Long id) {
        Agendamentos agendamento = obterAgendamento(id);

        validarStatus(agendamento, "EM_ANDAMENTO");

        agendamento.setStatus("CONCLUIDO");
        agendamentosRepository.save(agendamento);
    }

    @Transactional
    public void cancelar(Long id) {
        Agendamentos agendamento = obterAgendamento(id);
        String status = agendamento.getStatus();

        if ("CONCLUIDO".equalsIgnoreCase(status)
                || "CANCELADO".equalsIgnoreCase(status)) {
            throw new IllegalStateException(
                    "Este agendamento não pode ser cancelado."
            );
        }

        agendamento.setStatus("CANCELADO");
        agendamentosRepository.save(agendamento);
    }

    @Transactional
    public void excluir(Long id) {
        if (!agendamentosRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Agendamento não encontrado: " + id
            );
        }

        agendamentosRepository.deleteById(id);
    }

    private Agendamentos obterAgendamento(Long id) {
        return agendamentosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Agendamento não encontrado: " + id
                ));
    }

    private void validarStatus(
            Agendamentos agendamento,
            String statusEsperado) {

        if (agendamento.getStatus() == null
                || !statusEsperado.equalsIgnoreCase(
                agendamento.getStatus())) {

            throw new IllegalStateException(
                    "O agendamento precisa estar com status "
                            + statusEsperado + "."
            );
        }
    }
}