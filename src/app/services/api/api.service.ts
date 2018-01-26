import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiService {

  private url;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  setApiUrl(url) {
    this.url = url;
  }

  get(endpoint) {
    return this.http.get(this.url+endpoint, this.options());
  }

  post(endpoint, data) {
    return this.http.post(this.url+endpoint, data, this.options());
  }

  delete(endpoint) {
    return this.http.delete(this.url+endpoint, this.options());
  }

  private options() {
    let headers = new HttpHeaders()
      .append('Authorization', 'Bearer '+this.authService.token());

    return { headers };
  }

}
