
package com.br.estetickelite.Service;

import com.br.estetickelite.Model.Agendamentos;
import com.br.estetickelite.Repository.AgendamentosRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentosService {

    private final AgendamentosRepository agendamentosRepository;

    public AgendamentosService(
            AgendamentosRepository agendamentosRepository) {
        this.agendamentosRepository = agendamentosRepository;
    }

    public Agendamentos salvar(Agendamentos agendamento) {
        return agendamentosRepository.save(agendamento);
    }

    public List<Agendamentos> listarTodos() {
        return agendamentosRepository.findAll();
    }

    public Agendamentos buscarPorId(Long id) {
        return agendamentosRepository.findById(id)
                .orElse(null);
    }

    public void excluir(Long id) {
        agendamentosRepository.deleteById(id);
    }
}
