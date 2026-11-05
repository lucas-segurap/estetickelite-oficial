package com.br.estetickelite.Controller;

import com.br.estetickelite.Model.Veiculo;
import com.br.estetickelite.Model.Clientes;
import com.br.estetickelite.Repository.VeiculosRepository;
import com.br.estetickelite.Repository.ClientesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculosRepository veiculosRepository;

    @Autowired
    private ClientesRepository clientesRepository;

    // Exibir formulário de cadastro
    @GetMapping("/novo")
    public String novo(Model model) {

        model.addAttribute("veiculo", new Veiculo());
        model.addAttribute("clientes", clientesRepository.findAll());

        return "veiculos/cadastro";
    }

    // Salvar veículo
    @PostMapping("/salvar")
    public String salvar(
            @ModelAttribute Veiculo veiculo,
            @RequestParam Long clienteId) {

        Clientes cliente = clientesRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        veiculo.setCliente(cliente);

        veiculosRepository.save(veiculo);

        return "redirect:/veiculos/listar";
    }

    // Listar veículos
    @GetMapping("/listar")
    public String listar(Model model) {

        model.addAttribute("veiculos", veiculosRepository.findAll());

        return "veiculos/lista";
    }

    // Excluir veículo
    @GetMapping("/excluir/{id}")
    public String excluir(@PathVariable Long id) {

        veiculosRepository.deleteById(id);

        return "redirect:/veiculos/listar";
    }
}