import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {

  private url;

  constructor(private http: HttpClient) {
    this.url = environment.apiURL;
  }

  get(endpoint) {
    return this.http.get(this.url+endpoint);
  }

  post(endpoint, data) {
    return this.http.post(this.url+endpoint, data);
  }

  put(endpoint, data) {
    return this.http.put(this.url+endpoint, data);
  }


}
