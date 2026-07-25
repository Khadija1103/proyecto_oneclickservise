package com.oneclickservice.oneclickservicebackend.controller;

import com.oneclickservice.oneclickservicebackend.dto.LoginDTO;
import com.oneclickservice.oneclickservicebackend.dto.UsuarioDTO;
import com.oneclickservice.oneclickservicebackend.entity.Rol;
import com.oneclickservice.oneclickservicebackend.entity.Usuario;
import com.oneclickservice.oneclickservicebackend.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // =====================================================
    // LISTAR USUARIOS
    // =====================================================

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // =====================================================
    // REGISTRAR USUARIO
    // Todo usuario nuevo inicia como CLIENTE
    // =====================================================

    @PostMapping
    public Usuario guardarUsuario(@RequestBody UsuarioDTO usuarioDTO) {

        Usuario usuario = new Usuario();

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        usuario.setCorreo(usuarioDTO.getCorreo());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setPassword(usuarioDTO.getPassword());
        usuario.setRol(Rol.CLIENTE);

        return usuarioService.guardarUsuario(usuario);
    }

    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public Usuario login(@RequestBody LoginDTO loginDTO) {
        return usuarioService.iniciarSesion(
                loginDTO.getCorreo(),
                loginDTO.getPassword()
        );
    }

    // =====================================================
    // ACTUALIZAR PERFIL
    // =====================================================

    @PutMapping("/{id}")
    public Usuario actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        return usuarioService.actualizarUsuario(id, usuario);
    }
}