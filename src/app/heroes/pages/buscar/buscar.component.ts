import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Heroe } from '../../interfaces/Heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  termino:string = "";
  heroes:Heroe[]=[];
  heroeSeleccionado:Heroe | undefined;

  constructor(private heroesService:HeroesService) { }

  ngOnInit(): void {
  }

  buscando(){
    this.heroesService.getSugerencias(this.termino)
      .subscribe(heroes=>this.heroes = heroes)
  }

  opcionSeleccionada(event:MatAutocompleteSelectedEvent){

    if(event.option.value==""){
      this.heroeSeleccionado = undefined;
      return
    }
    const hero:Heroe = event.option.value;
    this.termino = hero.superhero

    this.heroesService.getHeroeByName(hero.id!)
      .subscribe(heroe=>this.heroeSeleccionado = heroe)
  }

}
