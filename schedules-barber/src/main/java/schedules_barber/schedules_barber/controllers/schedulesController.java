package schedules_barber.schedules_barber.controllers;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import schedules_barber.schedules_barber.dto.ScheduleRequest;
import schedules_barber.schedules_barber.models.schedules;
import schedules_barber.schedules_barber.services.scheduleservice;

@RestController
@RequestMapping("/schedules")
public class schedulesController {

    private final scheduleservice service;

    public schedulesController(scheduleservice service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ScheduleRequest request) {
        try {
            schedules s = mapToEntity(request);
            schedules saved = service.create(s);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{year}/{month}")
    public ResponseEntity<List<schedules>> listByMonth(@PathVariable int year, @PathVariable int month) {
        return ResponseEntity.ok(service.listByMonth(year, month));
    }

    @GetMapping
    public ResponseEntity<List<schedules>> listAll(@RequestParam(required = false) Integer year,
                                                   @RequestParam(required = false) Integer month) {
        if (year != null && month != null) {
            return ResponseEntity.ok(service.listByMonth(year, month));
        }
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/listschedules")
    public ResponseEntity<List<schedules>> listSchedules() {
        return ResponseEntity.ok(service.listAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Manual mapper
    private schedules mapToEntity(ScheduleRequest req) {
        schedules s = new schedules();
        if (req.getStartAt() != null) {
            OffsetDateTime odt = OffsetDateTime.parse(req.getStartAt());
            s.setDate(odt.toLocalDateTime());
        }
        if (req.getEndAt() != null) {
            OffsetDateTime odt2 = OffsetDateTime.parse(req.getEndAt());
            s.setEndAt(odt2.toLocalDateTime());
        }
        // Mapear campos opcionais de cliente/barbeiro/serviço
        if (req.getClientName() != null) s.setClientName(req.getClientName());
        if (req.getClientEmail() != null) s.setClientEmail(req.getClientEmail());
        if (req.getClientPhone() != null) s.setClientPhone(req.getClientPhone());
        if (req.getBarberName() != null) s.setBarberName(req.getBarberName());
        if (req.getService() != null) s.setService(req.getService());
        return s;
    }
}
