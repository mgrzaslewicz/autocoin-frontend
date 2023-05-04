import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {AuthServiceUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class SignupService {

    constructor(private http: HttpClient,
                @Inject(AuthServiceUrlToken) private authServiceUrl: string,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public signup(emailAddress: string): Observable<SignupResponseDto> {
        const body: SignupRequestDto = {
            emailAddress: emailAddress
        };
        return this.http.put<SignupResponseDto>(`${this.authServiceUrl}/user-accounts`, body);
    }

}

export interface SignupRequestDto {
    emailAddress: String;
}

export interface SignupResponseDto {
    userAccountId: String;
    emailAddress: String;
}

