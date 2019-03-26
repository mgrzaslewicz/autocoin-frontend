import {inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {AllowOnlyLoggedInGuard} from './allow-only-logged-in-guard.service';

describe('AllowOnlyLoggedInGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [AllowOnlyLoggedInGuard]
        });
    });

    it('should ...', inject([AllowOnlyLoggedInGuard], (guard: AllowOnlyLoggedInGuard) => {
        expect(guard).toBeTruthy();
    }));
});
