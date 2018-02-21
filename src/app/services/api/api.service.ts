import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    get(url) {
        return this.http.get(url, this.options());
    }

    post(url, data) {
        return this.http.post(url, data, this.options());
    }

    put(url, data) {
        return this.http.put(url, data, this.options());
    }

    delete(url) {
        return this.http.delete(url, this.options());
    }

    private options() {
        let headers = new HttpHeaders()
            .append('Authorization', 'Bearer ' + this.authService.token());
        
        return {headers};
    }

}
