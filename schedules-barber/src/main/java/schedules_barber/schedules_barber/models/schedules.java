package schedules_barber.schedules_barber.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import static jakarta.persistence.GenerationType.IDENTITY;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter

@ToString
@Entity
public class schedules {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String clientName;

    @Column(nullable = true)
    private String clientEmail;

    @Column(nullable = true)
    private String clientPhone;

    @Column(nullable = true)
    private String barberName;

    @Column(nullable = false)
    private LocalDateTime date; // start time

    @Column(nullable = true)
    private LocalDateTime endAt; // end time

    @Column(nullable = true)
    private String service;

    
    


}
