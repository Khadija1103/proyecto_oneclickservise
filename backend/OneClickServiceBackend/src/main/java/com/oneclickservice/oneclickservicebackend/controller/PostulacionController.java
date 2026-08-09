package com.oneclickservice.oneclickservicebackend.controller;

import com.oneclickservice.oneclickservicebackend.entity.Postulacion;
import com.oneclickservice.oneclickservicebackend.repository.PostulacionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/postulaciones")
@CrossOrigin(origins = "*")
public class PostulacionController {

    private final PostulacionRepository postulacionRepository;

    public PostulacionController(PostulacionRepository postulacionRepository) {
        this.postulacionRepository = postulacionRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> crearPostulacion(

            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String tipoDocumento,
            @RequestParam String documento,
            @RequestParam String fechaNacimiento,
            @RequestParam String correo,
            @RequestParam String telefono,
            @RequestParam String ciudad,
            @RequestParam String direccion,
            @RequestParam String profesion,
            @RequestParam String especialidad,
            @RequestParam String categoria,
            @RequestParam String experiencia,
            @RequestParam String disponibilidad,
            @RequestParam String descripcion,
            @RequestParam String servicios,
            @RequestParam String precioMinimo,
            @RequestParam String precioMaximo,
            @RequestParam String horaInicio,
            @RequestParam String horaFin,
            @RequestParam String diasDisponibles,
            @RequestParam String referencia1,
            @RequestParam String telefonoReferencia1,
            @RequestParam String referencia2,
            @RequestParam String telefonoReferencia2,

            @RequestParam Boolean aceptaDatos,
            @RequestParam Boolean aceptaInformacion,
            @RequestParam Boolean aceptaTerminos,

            @RequestParam(required = false) MultipartFile fotoPerfil,
            @RequestParam(required = false) MultipartFile hojaVida,
            @RequestParam(required = false) MultipartFile certificados,
            @RequestParam(required = false) MultipartFile portafolio

    ) throws IOException {

        Postulacion postulacion = new Postulacion();

        postulacion.setNombre(nombre);
        postulacion.setApellido(apellido);
        postulacion.setTipoDocumento(tipoDocumento);
        postulacion.setDocumento(documento);
        postulacion.setFechaNacimiento(fechaNacimiento);
        postulacion.setCorreo(correo);
        postulacion.setTelefono(telefono);
        postulacion.setCiudad(ciudad);
        postulacion.setDireccion(direccion);
        postulacion.setProfesion(profesion);
        postulacion.setEspecialidad(especialidad);
        postulacion.setCategoria(categoria);
        postulacion.setExperiencia(experiencia);
        postulacion.setDisponibilidad(disponibilidad);
        postulacion.setDescripcion(descripcion);
        postulacion.setServicios(servicios);
        postulacion.setPrecioMinimo(precioMinimo);
        postulacion.setPrecioMaximo(precioMaximo);
        postulacion.setHoraInicio(horaInicio);
        postulacion.setHoraFin(horaFin);
        postulacion.setDiasDisponibles(diasDisponibles);

        postulacion.setReferencia1(referencia1);
        postulacion.setTelefonoReferencia1(telefonoReferencia1);
        postulacion.setReferencia2(referencia2);
        postulacion.setTelefonoReferencia2(telefonoReferencia2);

        postulacion.setAceptaDatos(aceptaDatos);
        postulacion.setAceptaInformacion(aceptaInformacion);
        postulacion.setAceptaTerminos(aceptaTerminos);

        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            postulacion.setFotoPerfil(fotoPerfil.getBytes());
        }

        if (hojaVida != null && !hojaVida.isEmpty()) {
            postulacion.setHojaVida(hojaVida.getBytes());
        }

        if (certificados != null && !certificados.isEmpty()) {
            postulacion.setCertificados(certificados.getBytes());
        }

        if (portafolio != null && !portafolio.isEmpty()) {
            postulacion.setPortafolio(portafolio.getBytes());
        }

        Postulacion guardada = postulacionRepository.save(postulacion);

        return ResponseEntity.ok(guardada);
    }
}