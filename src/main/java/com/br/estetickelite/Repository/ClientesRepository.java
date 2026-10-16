
package com.br.estetickelite.Repository;

import com.br.estetickelite.Model.Clientes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientesRepository
        extends JpaRepository<Clientes, Long> {

    Optional<Clientes> findByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);
}
