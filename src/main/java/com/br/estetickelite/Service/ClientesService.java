
package com.br.estetickelite.Service;

import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Model.Veiculo;

import com.br.estetickelite.Repository.ClientesRepository;
import com.br.estetickelite.Repository.VeiculosRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {

    private final ClientesRepository clientesRepository;
    private final VeiculosRepository veiculosRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ClientesService(
            ClientesRepository clientesRepository,
            VeiculosRepository veiculosRepository) {

        this.clientesRepository = clientesRepository;
        this.veiculosRepository = veiculosRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Salvar somente cliente
    public Clientes salvar(Clientes cliente) {

        if (cliente.getSenha() != null
                && !cliente.getSenha().isBlank()) {

            cliente.setSenha(
                    passwordEncoder.encode(cliente.getSenha())
            );
        }

        return clientesRepository.save(cliente);
    }

    // Salvar cliente e veículo juntos
    @Transactional
    public Clientes salvarComVeiculo(
            Clientes cliente,
            Veiculo veiculo) {

        if (cliente.getSenha() != null
                && !cliente.getSenha().isBlank()) {

            cliente.setSenha(
                    passwordEncoder.encode(cliente.getSenha())
            );
        }

        // Primeiro salva o cliente
        Clientes clienteSalvo =
                clientesRepository.save(cliente);

        // Associa o veículo ao cliente
        veiculo.setCliente(clienteSalvo);

        // Depois salva o veículo
        veiculosRepository.save(veiculo);

        return clienteSalvo;
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
