
package com.br.estetickelite.Service;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Repository.ClientesRepository;

import org.springframework.stereotype.Service;

@Service
public class ClientesService {

    private final ClientesRepository clientesRepository;

    public ClientesService(ClientesRepository clientesRepository) {
        this.clientesRepository = clientesRepository;
    }

    public Clientes salvar(Clientes cliente) {
        return clientesRepository.save(cliente);
    }

    public java.util.List<Clientes> listarTodos() {
        return clientesRepository.findAll();
    }

    public java.util.Optional<Clientes> buscarPorId(Long id) {
        return clientesRepository.findById(id);
    }

    public void excluir(Long id) {
        clientesRepository.deleteById(id);
    }
}
