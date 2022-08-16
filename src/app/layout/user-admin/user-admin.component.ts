import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {AuthService} from '../../services/auth.service';
import {UserAccountService} from "../../services/user-account.service";

@Component({
    selector: 'app-user-admin',
    templateUrl: 'user-admin.component.html',
    styleUrls: ['user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {
    userEmailAddress: string = '';
    roleNameToAddOrRemove: string = 'ROLE_PRO_USER';
    isOperationInProgress: boolean = false;
    errorMessages: string[];

    constructor(
        private toastService: ToastService,
        private authService: AuthService,
        private userAccountService: UserAccountService) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
            });
    }

    addRole() {
        if (this.areInputsValid()) {
            this.userAccountService.addRoleToUser(this.roleNameToAddOrRemove, this.userEmailAddress)
                .subscribe(() => {
                        this.toastService.success('Role added');
                        this.isOperationInProgress = false;
                        this.errorMessages = [];
                    },
                    errorResponse => {
                        if (errorResponse.error && errorResponse.error.errorMessages) {
                            this.errorMessages = errorResponse.error.errorMessages;
                        }
                        this.isOperationInProgress = false;
                        this.toastService.danger('Something went wrong. Role was not added');
                    }
                );
        }
    }

    removeRole() {
        if (this.areInputsValid()) {
            this.userAccountService.removeRoleFromUser(this.roleNameToAddOrRemove, this.userEmailAddress)
                .subscribe(() => {
                        this.toastService.success('Role removed');
                        this.isOperationInProgress = false;
                        this.errorMessages = [];
                    },
                    errorResponse => {
                        if (errorResponse.error && errorResponse.error.errorMessages) {
                            this.errorMessages = errorResponse.error.errorMessages;
                        }
                        this.isOperationInProgress = false;
                        this.toastService.danger('Something went wrong. Role was not removed');
                    }
                );
        }
    }

    areInputsValid(): boolean {
        const result  = this.userEmailAddress.length > 0 && this.roleNameToAddOrRemove.length > 0;
        if (this.userEmailAddress.length === 0) {
            this.errorMessages = ['Email address is required'];
        } else if (this.roleNameToAddOrRemove.length === 0) {
            this.errorMessages = ['Role name is required'];
        } else {
            this.errorMessages = [];
        }
        return result;
    }

}
