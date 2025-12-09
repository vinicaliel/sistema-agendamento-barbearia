package schedules_barber.schedules_barber.services;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import schedules_barber.schedules_barber.models.schedules;
import schedules_barber.schedules_barber.repository.schedulesRepository;

@Service
public class scheduleserviceImpl implements scheduleservice {

    private final schedulesRepository repository;

    public scheduleserviceImpl(schedulesRepository repository) {
        this.repository = repository;
    }

    @Override
    public schedules create(schedules s) {
        return repository.save(s);
    }

    @Override
    public List<schedules> listByMonth(int year, int month) {
        return repository.findAll().stream()
                .filter(s -> s.getDate() != null && s.getDate().getYear() == year && s.getDate().getMonthValue() == month)
                .collect(Collectors.toList());
    }

    @Override
    public List<schedules> listAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
