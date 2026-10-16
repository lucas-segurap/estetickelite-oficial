
package com.br.estetickelite.Repository;

import com.br.estetickelite.Model.Agendamentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentosRepository
        extends JpaRepository<Agendamentos, Long> {
}
