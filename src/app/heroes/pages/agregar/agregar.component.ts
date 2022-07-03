import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/Heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles:[
    `
      img{
        width:100%;
        border-radius:5px
      }
    `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id:'DC Comics',
      desc:"DC-Comics"
    },
    {
      id:'Marvel Comics',
      desc:"Marvel-Comics"
    }
  ]
  heroe:Heroe={
    superhero:'',
    alter_ego:'',
    characters:'',
    publisher:Publisher.DCComics,
    alt_img:'',
    first_appearance:''
  }
  constructor(
      private heroeService:HeroesService,
      private activatedRoute:ActivatedRoute,
      private router:Router,
      private _snackBar: MatSnackBar,
      private dialog:MatDialog
      ) { }

  ngOnInit(): void {

    if(!this.router.url.includes("editar")){
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({id})=>this.heroeService.getHeroeByName(id))
      )
      .subscribe(heroe=>this.heroe = heroe)
    
  }

  guardar(){
    if(this.heroe.superhero.trim().length===0){
      return
    }

    if(this.heroe.id){
      this.heroeService.actualizarHeroe(this.heroe)
        .subscribe(heroe=>this.openSnackBar("Registro actualizado"))
    }else{
      this.heroeService.agregarHeroe(this.heroe)
      .subscribe(heroe=>{
        this.router.navigate(['/heroes/editar',heroe.id]);
        this.openSnackBar("Registro creado");
      })
    }

    
  }

  borrarHeroe(){

    const dialog = this.dialog.open(ConfirmarComponent,{
      width:"250px",
      data:this.heroe
    });

    dialog.afterClosed()
      .pipe(
        switchMap(resp=>
          resp && this.heroeService.borrarHeroe(this.heroe.id!))
      )
      .subscribe(resp=>{
        this.router.navigate(['/heroes'])
      })

    // dialog.afterClosed().subscribe(
    //   (resp)=>{
    //     if(resp){
    //       this.heroeService.borrarHeroe(this.heroe.id!)
    //       .subscribe(resp=>{
    //         this.router.navigate(['/heroes'])
    //       })
    //     }
    //   }
    // )
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,"ok!",{
      duration:2500
    });
  }

}
