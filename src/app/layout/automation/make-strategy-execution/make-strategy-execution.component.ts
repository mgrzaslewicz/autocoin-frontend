import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrencyPair, Client } from '../../../models';
import { WatchCurrencyPairsService } from '../../../services/watch-currency-pairs.service';
import { ClientsService } from '../../../services/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { StrategiesService } from '../../../services/automation/strategies.service';
import { Strategy } from '../../../models/strategy';

@Component({
  selector: 'app-make-strategy-execution',
  templateUrl: './make-strategy-execution.component.html',
  styleUrls: ['./make-strategy-execution.component.scss']
})
export class MakeStrategyExecutionComponent implements OnInit {

  public exchangeName;

  public allExchangePairs: CurrencyPair[];

  public exchangePair: string;

  public selectedClients = [];

  public strategies: Strategy[];

  @ViewChild('confirmContent')
  confirmContentModal;

  @ViewChild('makeOrderForm')
  makeOrderForm;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private watchedCurrencyPairs: WatchCurrencyPairsService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private strategiesService: StrategiesService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.exchangeName = params.exchangeName;
    });

    this.allExchangePairs = this.watchedCurrencyPairs.all();

    this.loadClients();
    this.loadStrategies();
  }

  searchExchangePair = (text$: Observable<string>) => {
    return text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(exchangePairSymbol => exchangePairSymbol.toUpperCase())
      .map(exchangePairSymbol => {
        return this.allExchangePairs.filter(pair => pair.symbol().indexOf(exchangePairSymbol) > -1).slice(0, 10);
      })
      .map(pairs => pairs.map(pair => pair.symbol()));
  }

  private loadClients()
  {
    this.clientsService.getClients().subscribe(clients => {
      for (let client of clients) {
        this.selectedClients.push({ client: client, checked: false });
      }
    });
  }

  filteredSelectedClients()
  {
    return this.selectedClients.filter(client => client.checked);
  }

  showConfirmModal()
  {
    this.modalService.open(this.confirmContentModal, { windowClass: 'confirm-order-modal' }).result.then(result => {
      
      this.toastService.success('Orders has been placed correctly.');
    }, () => {});
  }

  canMakeStrategyExecution()
  {
    return this.filteredSelectedClients().length > 0
      && this.makeOrderForm.valid;
  }

  loadStrategies()
  {
    this.strategiesService.getStrategies().subscribe(strategies => {
      this.strategies = strategies;
    });
  }

}
