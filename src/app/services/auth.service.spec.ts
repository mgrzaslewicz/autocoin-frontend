import {async, inject, TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AuthService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpClientModule,
                HttpClientTestingModule,
                AuthService
            ]
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should save userName on login', async(inject([HttpClient, HttpTestingController, AuthService], (http: HttpClient, backend: HttpTestingController, service: AuthService) => {
        // TODO provide working test
        // given
        // http.post(service.usersApiToken, {}).subscribe();
        // when
        // service.login('test-user', 'test-password');
        // then
        // backend.expectOne(service.usersApiToken);
        // expect(service.userName).toEqual('test-user');
    })));

});
