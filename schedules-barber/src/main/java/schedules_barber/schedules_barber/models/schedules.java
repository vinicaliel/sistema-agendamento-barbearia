package schedules_barber.schedules_barber.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import static jakarta.persistence.GenerationType.IDENTITY;

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

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String clientEmail;

    @Column(nullable = false)
    private String clientPhone;

    @Column(nullable = false)
    private String barberName;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String service;

    
    


}
