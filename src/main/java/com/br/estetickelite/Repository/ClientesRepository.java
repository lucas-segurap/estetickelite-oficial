
package com.br.estetickelite.Repository;

import com.br.estetickelite.Model.Clientes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientesRepository
        extends JpaRepository<Clientes, Long> {

}
