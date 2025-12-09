package schedules_barber.schedules_barber.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleRequest {
    private String startAt; // ISO string
    private String endAt;   // ISO string (optional)
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String barberName;
    private String service;
}
