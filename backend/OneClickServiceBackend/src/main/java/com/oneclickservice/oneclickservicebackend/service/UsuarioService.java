package com.oneclickservice.oneclickservicebackend.service;

import com.oneclickservice.oneclickservicebackend.entity.Usuario;

import java.util.List;

public interface UsuarioService {

    List<Usuario> listarUsuarios();

    Usuario guardarUsuario(Usuario usuario);

    Usuario iniciarSesion(String correo, String password);

    Usuario actualizarUsuario(Long id, Usuario usuario);

}