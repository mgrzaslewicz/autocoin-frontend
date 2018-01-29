import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ClientsService } from '../../../services/api';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss']
})
export class ClientCreateComponent implements OnInit {

  private loading = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private clientsService: ClientsService
  ) { }

  ngOnInit() { }

  onSubmit(createForm) { 
    this.loading = true;

    this.clientsService.createClient({ name: createForm.value.name })
      .subscribe(() => {
        this.toastService.success('Client has been created.');
        this.router.navigate(['/clients']);
      }, error => {
        this.toastService.danger(error.message);
        this.loading = false;
      });
    
  }

}
