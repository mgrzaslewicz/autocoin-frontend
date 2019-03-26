import {inject, TestBed} from '@angular/core/testing';

import {AllowOnlyNotLoggedInGuard} from './allow-only-not-logged-in-guard.service';

describe('AllowOnlyNotLoggedInGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AllowOnlyNotLoggedInGuard]
        });
    });

    it('should ...', inject([AllowOnlyNotLoggedInGuard], (guard: AllowOnlyNotLoggedInGuard) => {
        expect(guard).toBeTruthy();
    }));
});
