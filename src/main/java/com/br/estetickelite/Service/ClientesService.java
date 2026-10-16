
package com.br.estetickelite.Service;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Repository.ClientesRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {

    private final ClientesRepository clientesRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ClientesService(
            ClientesRepository clientesRepository) {

        this.clientesRepository = clientesRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Clientes salvar(Clientes cliente) {

        if (cliente.getSenha() != null
                && !cliente.getSenha().isBlank()) {

            String senhaCriptografada =
                    passwordEncoder.encode(cliente.getSenha());

            cliente.setSenha(senhaCriptografada);
        }

        return clientesRepository.save(cliente);
    }

    public List<Clientes> listarTodos() {
        return clientesRepository.findAll();
    }

    public Optional<Clientes> buscarPorId(Long id) {
        return clientesRepository.findById(id);
    }

    public boolean cpfExiste(String cpf) {
        return clientesRepository.existsByCpf(cpf);
    }

    public boolean emailExiste(String email) {
        return clientesRepository.existsByEmail(email);
    }

    public void excluir(Long id) {
        clientesRepository.deleteById(id);
    }
}
