package com.oneclickservice.oneclickservicebackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "postulaciones")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String tipoDocumento;
    private String documento;
    private String fechaNacimiento;
    private String correo;
    private String telefono;
    private String ciudad;
    private String direccion;
    private String profesion;
    private String especialidad;
    private String categoria;
    private String experiencia;
    private String disponibilidad;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String servicios;

    private String precioMinimo;
    private String precioMaximo;
    private String horaInicio;
    private String horaFin;

    private String diasDisponibles;

    private String referencia1;
    private String telefonoReferencia1;
    private String referencia2;
    private String telefonoReferencia2;

    private Boolean aceptaDatos;
    private Boolean aceptaInformacion;
    private Boolean aceptaTerminos;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fotoPerfil;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] hojaVida;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] certificados;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] portafolio;

    public Postulacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getProfesion() {
        return profesion;
    }

    public void setProfesion(String profesion) {
        this.profesion = profesion;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(String experiencia) {
        this.experiencia = experiencia;
    }

    public String getDisponibilidad() {
        return disponibilidad;
    }

    public void setDisponibilidad(String disponibilidad) {
        this.disponibilidad = disponibilidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getServicios() {
        return servicios;
    }

    public void setServicios(String servicios) {
        this.servicios = servicios;
    }

    public String getPrecioMinimo() {
        return precioMinimo;
    }

    public void setPrecioMinimo(String precioMinimo) {
        this.precioMinimo = precioMinimo;
    }

    public String getPrecioMaximo() {
        return precioMaximo;
    }

    public void setPrecioMaximo(String precioMaximo) {
        this.precioMaximo = precioMaximo;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
        this.horaFin = horaFin;
    }

    public String getDiasDisponibles() {
        return diasDisponibles;
    }

    public void setDiasDisponibles(String diasDisponibles) {
        this.diasDisponibles = diasDisponibles;
    }

    public String getReferencia1() {
        return referencia1;
    }

    public void setReferencia1(String referencia1) {
        this.referencia1 = referencia1;
    }

    public String getTelefonoReferencia1() {
        return telefonoReferencia1;
    }

    public void setTelefonoReferencia1(String telefonoReferencia1) {
        this.telefonoReferencia1 = telefonoReferencia1;
    }

    public String getReferencia2() {
        return referencia2;
    }

    public void setReferencia2(String referencia2) {
        this.referencia2 = referencia2;
    }

    public String getTelefonoReferencia2() {
        return telefonoReferencia2;
    }

    public void setTelefonoReferencia2(String telefonoReferencia2) {
        this.telefonoReferencia2 = telefonoReferencia2;
    }

    public Boolean getAceptaDatos() {
        return aceptaDatos;
    }

    public void setAceptaDatos(Boolean aceptaDatos) {
        this.aceptaDatos = aceptaDatos;
    }

    public Boolean getAceptaInformacion() {
        return aceptaInformacion;
    }

    public void setAceptaInformacion(Boolean aceptaInformacion) {
        this.aceptaInformacion = aceptaInformacion;
    }

    public Boolean getAceptaTerminos() {
        return aceptaTerminos;
    }

    public void setAceptaTerminos(Boolean aceptaTerminos) {
        this.aceptaTerminos = aceptaTerminos;
    }

    public byte[] getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(byte[] fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public byte[] getHojaVida() {
        return hojaVida;
    }

    public void setHojaVida(byte[] hojaVida) {
        this.hojaVida = hojaVida;
    }

    public byte[] getCertificados() {
        return certificados;
    }

    public void setCertificados(byte[] certificados) {
        this.certificados = certificados;
    }

    public byte[] getPortafolio() {
        return portafolio;
    }

    public void setPortafolio(byte[] portafolio) {
        this.portafolio = portafolio;
    }
}