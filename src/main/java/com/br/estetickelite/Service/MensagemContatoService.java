
package com.br.estetickelite.Service;

import com.br.estetickelite.Model.MensagemContato;
import com.br.estetickelite.Repository.MensagemContatoRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensagemContatoService {

    private final MensagemContatoRepository repository;

    public MensagemContatoService(
            MensagemContatoRepository repository) {
        this.repository = repository;
    }

    public MensagemContato salvar(MensagemContato mensagem) {
        return repository.save(mensagem);
    }

    public List<MensagemContato> listarTodas() {
        return repository.findAll();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
