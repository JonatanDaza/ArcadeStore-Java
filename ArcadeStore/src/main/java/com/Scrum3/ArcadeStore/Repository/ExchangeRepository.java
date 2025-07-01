package com.Scrum3.ArcadeStore.Repository;

import com.Scrum3.ArcadeStore.entities.Exchange;
import com.Scrum3.ArcadeStore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    // CORREGIDO: El método ahora busca en los dos campos de usuario de la entidad Exchange.
    // Esto encontrará todos los intercambios en los que un usuario está involucrado,
    // ya sea como solicitante o como propietario del juego solicitado.
    List<Exchange> findByRequesterOrOwner(User requester, User owner);
}