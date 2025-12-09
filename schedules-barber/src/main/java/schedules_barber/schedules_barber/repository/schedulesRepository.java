package schedules_barber.schedules_barber.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import schedules_barber.schedules_barber.models.schedules;

public interface schedulesRepository extends JpaRepository<schedules , Long > {
  

}
