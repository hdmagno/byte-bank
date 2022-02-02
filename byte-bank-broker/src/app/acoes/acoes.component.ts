import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { Subscription, merge, Observable } from 'rxjs';
import {
  tap,
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit {
  acoesInput = new FormControl();
  todasAcoes$: Observable<Acoes>;
  filtroPeloInput$: Observable<Acoes>;
  acoes$: Observable<Acoes>;

  constructor(private acoesService: AcoesService) {}

  ngOnInit(): void {
    this.todasAcoes$ = this.acoesService.getAcoes().pipe(
      tap(() => {
        console.log('Fluxo Inicial');
      })
    );
    this.filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
      debounceTime(ESPERA_DIGITACAO),
      tap(() => {
        console.log('Fluxo do Filtro');
      }),
      tap(console.log),
      filter(valorDigitado => valorDigitado.length >= 3 || !valorDigitado.length
      ),
      distinctUntilChanged(),
      switchMap(valorDigitado => this.acoesService.getAcoes(valorDigitado)),
      tap(console.log)
    );
    this.acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);
  }
}
