package com.xiaojusurvey.engine.common.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Status implements Serializable {
    private static final long serialVersionUID = 2408931688513907276L;

    private Long date;

    private String status;


    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
