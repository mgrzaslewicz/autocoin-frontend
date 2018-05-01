import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    get<T>(url): Observable<T> {
        return this.http.get<T>(url, this.options());
    }

    post<T>(url, data): Observable<T> {
        return this.http.post<T>(url, data, this.options());
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
