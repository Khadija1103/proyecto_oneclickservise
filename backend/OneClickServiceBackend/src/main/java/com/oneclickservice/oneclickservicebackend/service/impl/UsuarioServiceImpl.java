package com.oneclickservice.oneclickservicebackend.service.impl;

import com.oneclickservice.oneclickservicebackend.entity.Usuario;
import com.oneclickservice.oneclickservicebackend.repository.UsuarioRepository;
import com.oneclickservice.oneclickservicebackend.service.UsuarioService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UsuarioServiceImpl implements UsuarioService {


    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;



    public UsuarioServiceImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;

    }





    // =====================================================
    // LISTAR USUARIOS
    // =====================================================

    @Override
    public List<Usuario> listarUsuarios() {

        return usuarioRepository.findAll();

    }






    // =====================================================
    // GUARDAR USUARIO
    // =====================================================

    @Override
    public Usuario guardarUsuario(Usuario usuario) {


        usuario.setPassword(
                passwordEncoder.encode(usuario.getPassword())
        );


        return usuarioRepository.save(usuario);

    }







    // =====================================================
    // LOGIN
    // =====================================================

    @Override
    public Usuario iniciarSesion(
            String correo,
            String password) {


        Usuario usuario =
                usuarioRepository
                        .findByCorreo(correo)
                        .orElse(null);



        if(usuario == null){

            return null;

        }



        if(password.equals(usuario.getPassword())){

            return usuario;

        }



        return null;

    }








    // =====================================================
    // ACTUALIZAR PERFIL
    // Incluye fotoPerfil
    // =====================================================

    @Override
    public Usuario actualizarUsuario(
            Long id,
            Usuario datosUsuario) {


        Usuario usuario =
                usuarioRepository
                        .findById(id)
                        .orElse(null);




        if(usuario == null){

            return null;

        }





        usuario.setNombre(
                datosUsuario.getNombre()
        );



        usuario.setApellido(
                datosUsuario.getApellido()
        );



        usuario.setTelefono(
                datosUsuario.getTelefono()
        );



        usuario.setCorreo(
                datosUsuario.getCorreo()
        );



        usuario.setRol(
                datosUsuario.getRol()
        );



        // GUARDAR FOTO DE PERFIL

        usuario.setFotoPerfil(
                datosUsuario.getFotoPerfil()
        );





        return usuarioRepository.save(usuario);

    }


}