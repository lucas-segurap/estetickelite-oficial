package com.br.estetickelite.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
public class Agendamentos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String veiculo;

    private LocalTime horario;

    @Column(length = 500)
    private String observacoes;

    private Integer tipoServicos;

    private BigDecimal totalServicos;

    private Integer formaPag;

    private LocalDate data;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "status", length = 20)
    private String status = "AGENDADO";

    public Agendamentos() {
    }

    @PrePersist
    public void definirStatusInicial() {
        if (status == null || status.isBlank()) {
            status = "AGENDADO";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Integer getTipoServicos() {
        return tipoServicos;
    }

    public void setTipoServicos(Integer tipoServicos) {
        this.tipoServicos = tipoServicos;
    }

    public BigDecimal getTotalServicos() {
        return totalServicos;
    }

    public void setTotalServicos(BigDecimal totalServicos) {
        this.totalServicos = totalServicos;
    }

    public Integer getFormaPag() {
        return formaPag;
    }

    public void setFormaPag(Integer formaPag) {
        this.formaPag = formaPag;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}