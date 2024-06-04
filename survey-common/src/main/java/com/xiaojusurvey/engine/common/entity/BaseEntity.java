package com.xiaojusurvey.engine.common.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.List;

@Data
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = -1166246812384704515L;

    @Id
    private String id;

    private Long createDate;

    private Long updateDate;

    private Status curStatus;

    private List<Status> statusList;

}
