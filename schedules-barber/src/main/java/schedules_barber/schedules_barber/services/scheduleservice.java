package schedules_barber.schedules_barber.services;

import java.util.List;

import schedules_barber.schedules_barber.models.schedules;

public interface scheduleservice {
	schedules create(schedules s);

	List<schedules> listByMonth(int year, int month);

	List<schedules> listAll();

	void deleteById(Long id);

}
